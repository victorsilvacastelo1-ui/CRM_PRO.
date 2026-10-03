import { test as base, expect, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const adminSupabase = createClient(
  process.env.VITE_SUPABASE_URL ?? "http://127.0.0.1:54341",
  process.env.SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

// Tables in FK-safe deletion order (children before parents)
const TABLES = [
  "tasks",
  "contact_notes",
  "deal_notes",
  "deals",
  "contacts",
  "companies",
  "tags",
  "favicons_excluded_domains",
  "configuration",
  "sales",
  "organization_members",
  "organizations",
];

async function resetDb() {
  for (const table of TABLES) {
    // Supabase client delete need a where clause to get executed, so we use one that will match on all rows (id is not null)
    await adminSupabase.from(table).delete().not("id", "is", null);
  }

  // Delete all auth users (cascades to sales via DB trigger)
  const { data } = await adminSupabase.auth.admin.listUsers();
  await Promise.all(
    data.users.map((user) => adminSupabase.auth.admin.deleteUser(user.id)),
  );
}

async function createUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return data.user;
}

async function createSales({
  first_name,
  last_name,
  email,
  password,
  administrator = false,
  organization_id,
}: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  administrator?: boolean;
  organization_id?: number;
}) {
  const { data: userData, error: userError } =
    await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      ...(organization_id
        ? {
            app_metadata: {
              organization_id,
              organization_role: administrator ? "admin" : "member",
            },
          }
        : {
            user_metadata: {
              organization_name: `E2E Organization ${crypto.randomUUID()}`,
            },
          }),
    });

  if (userError || !userData.user) {
    throw new Error(`Failed to create sales: ${userError?.message}`);
  }

  const { data: createdSale, error: saleLookupError } = await adminSupabase
    .from("sales")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (saleLookupError || !createdSale) {
    throw new Error(
      `Failed to resolve created sale: ${saleLookupError?.message}`,
    );
  }

  // Local E2E projects can run browser projects concurrently. Never infer the
  // tenant from another arbitrary sale: when a tenant is explicitly requested,
  // reconcile the trigger-created records to that tenant deterministically.
  if (
    organization_id != null &&
    createdSale.organization_id !== organization_id
  ) {
    const originalOrganizationId = createdSale.organization_id;

    const { error: moveSaleError } = await adminSupabase
      .from("sales")
      .update({ organization_id })
      .eq("id", createdSale.id);

    if (moveSaleError) {
      throw new Error(`Failed to move sale to organization: ${moveSaleError.message}`);
    }

    await adminSupabase
      .from("organization_members")
      .delete()
      .eq("user_id", userData.user.id);

    const { error: membershipInsertError } = await adminSupabase
      .from("organization_members")
      .insert({
        organization_id,
        user_id: userData.user.id,
        role: administrator ? "admin" : "member",
      });

    if (membershipInsertError) {
      throw new Error(
        `Failed to move organization membership: ${membershipInsertError.message}`,
      );
    }

    // Clean up the isolated organization created by the auth trigger when it
    // is no longer referenced.
    await adminSupabase
      .from("organizations")
      .delete()
      .eq("id", originalOrganizationId);
  }

  const { data, error } = await adminSupabase
    .from("sales")
    .update({ first_name, last_name, administrator })
    .eq("user_id", userData.user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create sales: ${error.message}`);
  }

  await adminSupabase
    .from("organization_members")
    .update({ role: administrator ? "admin" : "member" })
    .eq("user_id", userData.user.id)
    .eq("organization_id", data.organization_id);

  return data;
}

async function createNotes({
  contactId,
  salesId,
  notes,
}: {
  contactId: string | number;
  salesId: string | number;
  notes: {
    text: string;
    date?: string;
    status?: "cold" | "warm" | "hot";
  }[];
}) {
  if (notes.length === 0) return;

  const { data: sale, error: saleError } = await adminSupabase
    .from("sales")
    .select("organization_id")
    .eq("id", salesId)
    .single();

  if (saleError || !sale) {
    throw new Error(`Failed to resolve organization: ${saleError?.message}`);
  }

  const { error } = await adminSupabase.from("contact_notes").insert(
    notes.map(({ text, date, status = "cold" }) => ({
      contact_id: contactId,
      sales_id: salesId,
      organization_id: sale.organization_id,
      text,
      date,
      status,
    })),
  );

  if (error) {
    throw new Error(`Failed to create notes: ${error.message}`);
  }
}

async function createCompany({
  name,
  salesId,
}: {
  name: string;
  salesId: string | number;
}) {
  const { data: sale, error: saleError } = await adminSupabase
    .from("sales")
    .select("organization_id")
    .eq("id", salesId)
    .single();

  if (saleError || !sale) {
    throw new Error(`Failed to resolve organization: ${saleError?.message}`);
  }

  const { data, error } = await adminSupabase
    .from("companies")
    .insert({
      name,
      sales_id: salesId,
      organization_id: sale.organization_id,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create company: ${error.message}`);
  }

  return data;
}

async function createContact({
  first_name,
  last_name,
  title = "",
  company_id = null,
  sales_id,
  notes = [],
}: {
  first_name: string;
  last_name: string;
  title?: string;
  company_id?: string | number | null;
  sales_id: string | number;
  notes?: {
    text: string;
    date?: string;
    status?: "cold" | "warm" | "hot";
  }[];
}) {
  const { data: sale, error: saleError } = await adminSupabase
    .from("sales")
    .select("organization_id")
    .eq("id", sales_id)
    .single();

  if (saleError || !sale) {
    throw new Error(`Failed to resolve organization: ${saleError?.message}`);
  }

  const { data, error } = await adminSupabase
    .from("contacts")
    .insert({
      organization_id: sale.organization_id,
      first_name,
      last_name,
      title,
      company_id,
      sales_id,
      first_seen: new Date().toISOString(),
      last_seen: new Date().toISOString(),
      has_newsletter: false,
      tags: [],
      gender: "unknown",
      status: "cold",
      background: "",
      email_jsonb: [],
      phone_jsonb: [],
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create contact: ${error.message}`);
  }

  await createNotes({
    contactId: data.id,
    salesId: sales_id,
    notes,
  });

  return data;
}

const getMenuMethod = ({ page }: { page: Page; isMobile: boolean }) => ({
  goToDashboard: async () => {
    await page.getByRole("link", { name: "Dashboard" }).click();
    await page.waitForLoadState("networkidle");
  },
  goToContacts: async () => {
    await page.getByRole("link", { name: "Contacts" }).click();
    await page.waitForLoadState("networkidle");
  },
});

const dismissToast = async (page: Page, content: string) => {
  await expect(page.getByText(content)).toBeVisible();
  await page.getByLabel("Close toast").first().click();
  // Since we are in optimistic UI, dismissing the toast trigger the request to the api linked to the toast message
  await page.waitForLoadState("networkidle");
};

export const test = base.extend<{
  resetDb: void;
  createUser: typeof createUser;
  createSales: typeof createSales;
  createCompany: typeof createCompany;
  createContact: typeof createContact;
  createNotes: typeof createNotes;
  menu: ReturnType<typeof getMenuMethod>;
  dismissToast: (content: string) => Promise<void>;
}>({
  resetDb: [
    // The first argument to a Playwright fixture function must use object destructuring ({}) — _ is not allowed.
    // Playwright uses this to statically analyze which fixtures are requested.
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      await resetDb();
      await use();
    },
    { auto: true },
  ],
  // eslint-disable-next-line no-empty-pattern
  createUser: async ({}, cb) => {
    await cb(createUser);
  },
  // eslint-disable-next-line no-empty-pattern
  createSales: async ({}, cb) => {
    await cb(createSales);
  },
  // eslint-disable-next-line no-empty-pattern
  createCompany: async ({}, cb) => {
    await cb(createCompany);
  },
  // eslint-disable-next-line no-empty-pattern
  createContact: async ({}, cb) => {
    await cb(createContact);
  },
  // eslint-disable-next-line no-empty-pattern
  createNotes: async ({}, cb) => {
    await cb(createNotes);
  },
  menu: async ({ page, isMobile }, cb) => {
    await cb(getMenuMethod({ page, isMobile }));
  },
  dismissToast: async ({ page }, cb) => {
    await cb((content: string) => dismissToast(page, content));
  },
});

export { expect };
