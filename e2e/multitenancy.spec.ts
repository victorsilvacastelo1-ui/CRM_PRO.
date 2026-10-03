import { createClient } from "@supabase/supabase-js";
import { test, expect } from "./fixtures";

const supabaseUrl =
  process.env.VITE_SUPABASE_URL ?? "http://127.0.0.1:54341";
const publishableKey = process.env.VITE_SB_PUBLISHABLE_KEY!;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY!;

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const createTenantUser = async (
  email: string,
  password: string,
  organizationName: string,
) => {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: organizationName,
      last_name: "Admin",
      organization_name: organizationName,
    },
  });

  if (error || !data.user) {
    throw error ?? new Error("Failed to create tenant user");
  }

  return data.user;
};

const signInClient = async (email: string, password: string) => {
  const client = createClient(supabaseUrl, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;

  return client;
};

test("RLS isolates customer data between organizations", async () => {
  const password = "Password123!";

  const userA = await createTenantUser(
    "tenant-a@example.com",
    password,
    "Empresa A",
  );
  const userB = await createTenantUser(
    "tenant-b@example.com",
    password,
    "Empresa B",
  );

  const clientA = await signInClient(userA.email!, password);
  const clientB = await signInClient(userB.email!, password);

  const { data: companyA, error: insertAError } = await clientA
    .from("companies")
    .insert({ name: "Cliente exclusivo A" })
    .select("id, name, organization_id")
    .single();

  expect(insertAError).toBeNull();
  expect(companyA?.name).toBe("Cliente exclusivo A");

  const { data: companyB, error: insertBError } = await clientB
    .from("companies")
    .insert({ name: "Cliente exclusivo B" })
    .select("id, name, organization_id")
    .single();

  expect(insertBError).toBeNull();
  expect(companyB?.name).toBe("Cliente exclusivo B");
  expect(companyA?.organization_id).not.toBe(companyB?.organization_id);

  const { data: visibleToA, error: readAError } = await clientA
    .from("companies")
    .select("name");

  expect(readAError).toBeNull();
  expect(visibleToA?.map((row) => row.name)).toContain("Cliente exclusivo A");
  expect(visibleToA?.map((row) => row.name)).not.toContain(
    "Cliente exclusivo B",
  );

  const { data: visibleToB, error: readBError } = await clientB
    .from("companies")
    .select("name");

  expect(readBError).toBeNull();
  expect(visibleToB?.map((row) => row.name)).toContain("Cliente exclusivo B");
  expect(visibleToB?.map((row) => row.name)).not.toContain(
    "Cliente exclusivo A",
  );

  const { error: crossTenantInsertError } = await clientA
    .from("companies")
    .insert({
      name: "Tentativa cruzada",
      organization_id: companyB!.organization_id,
    });

  expect(crossTenantInsertError).not.toBeNull();

  const { data: salesVisibleToA, error: salesError } = await clientA
    .from("sales")
    .select("user_id, organization_id");

  expect(salesError).toBeNull();
  expect(salesVisibleToA).toHaveLength(1);
  expect(salesVisibleToA?.[0].user_id).toBe(userA.id);
});
