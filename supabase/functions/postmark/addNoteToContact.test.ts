// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addNoteToContact,
  findActiveSaleByEmail,
  getOrCreateCompanyFromDomain,
  getOrCreateContactFromEmailInfo,
} from "./addNoteToContact";

const mockFrom = vi.hoisted(() => vi.fn());

vi.mock("../_shared/supabaseAdmin.ts", () => ({
  supabaseAdmin: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

const organizationId = 77;

const companyLookup = (
  data: unknown,
  error: { message: string } | null = null,
) => ({
  select: () => ({
    eq: (column: string, value: number) => {
      expect(column).toBe("organization_id");
      expect(value).toBe(organizationId);
      return {
        or: () => ({
          maybeSingle: () => Promise.resolve({ data, error }),
        }),
      };
    },
  }),
});

const contactLookup = (
  data: unknown,
  error: { message: string } | null = null,
) => ({
  select: () => ({
    eq: (column: string, value: number) => {
      expect(column).toBe("organization_id");
      expect(value).toBe(organizationId);
      return {
        contains: () => ({
          maybeSingle: () => Promise.resolve({ data, error }),
        }),
      };
    },
  }),
});

const primaryLookup = (
  data: unknown,
  error: { message: string } | null = null,
) => ({
  select: () => ({
    eq: () => ({
      neq: () => ({
        maybeSingle: () => Promise.resolve({ data, error }),
      }),
    }),
  }),
});

const secondaryLookup = (
  rows: unknown[],
  error: { message: string } | null = null,
) => ({
  select: () => ({
    contains: () => ({
      neq: () => ({
        order: () => ({
          limit: () => Promise.resolve({ data: error ? null : rows, error }),
        }),
      }),
    }),
  }),
});

describe("addNoteToContact helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getOrCreateCompanyFromDomain", () => {
    const params = {
      domain: "acme.com",
      salesId: 42,
      companyName: "Acme",
      website: "https://acme.com",
      organizationId,
    };

    it("returns an existing company from the same organization", async () => {
      const company = { id: 1, name: "Acme", organization_id: organizationId };
      mockFrom.mockReturnValue(companyLookup(company));

      await expect(getOrCreateCompanyFromDomain(params)).resolves.toEqual(
        company,
      );
      expect(mockFrom).toHaveBeenCalledWith("companies");
    });

    it("does not create companies for generic mail providers", async () => {
      await expect(
        getOrCreateCompanyFromDomain({
          ...params,
          domain: "gmail.com",
          companyName: "Gmail",
          website: "https://gmail.com",
        }),
      ).resolves.toBeNull();

      expect(mockFrom).not.toHaveBeenCalled();
    });

    it("creates a missing company inside the organization", async () => {
      const company = { id: 2, name: "Acme", organization_id: organizationId };
      const insert = vi.fn().mockReturnValue({
        select: () => Promise.resolve({ data: [company], error: null }),
      });

      mockFrom
        .mockReturnValueOnce(companyLookup(null))
        .mockReturnValueOnce({ insert });

      await expect(getOrCreateCompanyFromDomain(params)).resolves.toEqual(
        company,
      );
      expect(insert).toHaveBeenCalledWith(
        expect.objectContaining({
          organization_id: organizationId,
          sales_id: 42,
        }),
      );
    });

    it("surfaces company lookup errors", async () => {
      mockFrom.mockReturnValue(companyLookup(null, { message: "DB error" }));

      await expect(getOrCreateCompanyFromDomain(params)).rejects.toThrow(
        "Could not fetch companies from database",
      );
    });

    it("surfaces company creation errors", async () => {
      mockFrom
        .mockReturnValueOnce(companyLookup(null))
        .mockReturnValueOnce({
          insert: () => ({
            select: () =>
              Promise.resolve({
                data: null,
                error: { message: "Insert failed" },
              }),
          }),
        });

      await expect(getOrCreateCompanyFromDomain(params)).rejects.toThrow(
        "Could not create company in database",
      );
    });
  });

  describe("getOrCreateContactFromEmailInfo", () => {
    const params = {
      email: "alice@acme.com",
      firstName: "Alice",
      lastName: "Smith",
      salesId: 42,
      domain: "acme.com",
      companyName: "Acme",
      website: "https://acme.com",
      organizationId,
    };

    it("returns an existing contact from the same organization", async () => {
      const contact = { id: 10, first_name: "Alice" };
      mockFrom.mockReturnValue(contactLookup(contact));

      await expect(getOrCreateContactFromEmailInfo(params)).resolves.toEqual(
        contact,
      );
    });

    it("creates a contact and keeps it in the organization", async () => {
      const company = { id: 1, name: "Acme" };
      const contact = { id: 11, company_id: 1 };
      const insertContact = vi.fn().mockReturnValue({
        select: () => Promise.resolve({ data: [contact], error: null }),
      });

      mockFrom
        .mockReturnValueOnce(contactLookup(null))
        .mockReturnValueOnce(companyLookup(company))
        .mockReturnValueOnce({ insert: insertContact });

      await expect(getOrCreateContactFromEmailInfo(params)).resolves.toEqual(
        contact,
      );
      expect(insertContact).toHaveBeenCalledWith(
        expect.objectContaining({
          organization_id: organizationId,
          sales_id: 42,
          company_id: 1,
        }),
      );
    });

    it("creates a contact without company for a generic mail provider", async () => {
      const contact = { id: 12, company_id: null };
      const insertContact = vi.fn().mockReturnValue({
        select: () => Promise.resolve({ data: [contact], error: null }),
      });

      mockFrom
        .mockReturnValueOnce(contactLookup(null))
        .mockReturnValueOnce({ insert: insertContact });

      await expect(
        getOrCreateContactFromEmailInfo({
          ...params,
          email: "alice@gmail.com",
          domain: "gmail.com",
          companyName: "Gmail",
          website: "https://gmail.com",
        }),
      ).resolves.toEqual(contact);

      expect(insertContact).toHaveBeenCalledWith(
        expect.objectContaining({
          company_id: null,
          organization_id: organizationId,
        }),
      );
    });

    it("surfaces contact lookup errors", async () => {
      mockFrom.mockReturnValue(contactLookup(null, { message: "DB error" }));

      await expect(getOrCreateContactFromEmailInfo(params)).rejects.toThrow(
        "Could not fetch contact from database",
      );
    });

    it("surfaces contact creation errors", async () => {
      mockFrom
        .mockReturnValueOnce(contactLookup(null))
        .mockReturnValueOnce(companyLookup({ id: 1 }))
        .mockReturnValueOnce({
          insert: () => ({
            select: () =>
              Promise.resolve({
                data: null,
                error: { message: "Insert failed" },
              }),
          }),
        });

      await expect(getOrCreateContactFromEmailInfo(params)).rejects.toThrow(
        "Could not create contact in database",
      );
    });
  });

  describe("findActiveSaleByEmail", () => {
    it("finds the active primary email", async () => {
      const sale = { id: 1, email: "sales@company.com" };
      mockFrom.mockReturnValue(primaryLookup(sale));

      const result = await findActiveSaleByEmail("sales@company.com");

      expect(result.data).toEqual(sale);
      expect(mockFrom).toHaveBeenCalledTimes(1);
    });

    it("falls back to a secondary email", async () => {
      const sale = {
        id: 1,
        email: "sales@company.com",
        secondary_emails: ["perso@gmail.com"],
      };
      mockFrom
        .mockReturnValueOnce(primaryLookup(null))
        .mockReturnValueOnce(secondaryLookup([sale]));

      const result = await findActiveSaleByEmail("perso@gmail.com");
      expect(result.data).toEqual(sale);
    });

    it("refuses an ambiguous secondary email", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);

      mockFrom
        .mockReturnValueOnce(primaryLookup(null))
        .mockReturnValueOnce(
          secondaryLookup([
            { id: 3, email: "a@company.com" },
            { id: 9, email: "b@company.com" },
          ]),
        );

      const result = await findActiveSaleByEmail("shared@x.com");

      expect(result).toEqual({ data: null, error: null });
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("3, 9"));
      consoleSpy.mockRestore();
    });

    it("normalizes the sender email", async () => {
      const eq = vi.fn().mockReturnValue({
        neq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
        }),
      });
      const contains = vi.fn().mockReturnValue({
        neq: () => ({
          order: () => ({
            limit: () =>
              Promise.resolve({
                data: [{ id: 1, email: "sales@company.com" }],
                error: null,
              }),
          }),
        }),
      });

      mockFrom
        .mockReturnValueOnce({ select: () => ({ eq }) })
        .mockReturnValueOnce({ select: () => ({ contains }) });

      await findActiveSaleByEmail("  Perso@Gmail.COM  ");

      expect(eq).toHaveBeenCalledWith("email", "perso@gmail.com");
      expect(contains).toHaveBeenCalledWith(
        "secondary_emails",
        '["perso@gmail.com"]',
      );
    });

    it("surfaces primary lookup errors without a secondary query", async () => {
      mockFrom.mockReturnValue(
        primaryLookup(null, { message: "Primary DB error" }),
      );

      const result = await findActiveSaleByEmail("sales@company.com");

      expect(result.error).toEqual({ message: "Primary DB error" });
      expect(mockFrom).toHaveBeenCalledTimes(1);
    });

    it("surfaces secondary lookup errors", async () => {
      mockFrom
        .mockReturnValueOnce(primaryLookup(null))
        .mockReturnValueOnce(secondaryLookup([], { message: "DB error" }));

      const result = await findActiveSaleByEmail("other@company.com");

      expect(result).toEqual({ data: null, error: { message: "DB error" } });
    });
  });

  describe("addNoteToContact", () => {
    const baseParams = {
      sales: { id: 1, organization_id: organizationId },
      salesEmail: "sales@company.com",
      email: "alice@acme.com",
      domain: "acme.com",
      firstName: "Alice",
      lastName: "Smith",
      noteContent: "A note",
      attachments: [],
      companyName: "Acme",
      website: "https://acme.com",
    };

    const successfulContactUpdate = {
      update: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      }),
    };

    it("creates a tenant-scoped note and updates last_seen", async () => {
      const insertNote = vi.fn().mockResolvedValue({ error: null });

      mockFrom
        .mockReturnValueOnce(contactLookup({ id: 10 }))
        .mockReturnValueOnce({ insert: insertNote })
        .mockReturnValueOnce(successfulContactUpdate);

      await expect(addNoteToContact(baseParams)).resolves.toBeUndefined();

      expect(insertNote).toHaveBeenCalledWith(
        expect.objectContaining({
          contact_id: 10,
          sales_id: 1,
          organization_id: organizationId,
        }),
      );
    });

    it("returns 500 when note creation fails", async () => {
      mockFrom
        .mockReturnValueOnce(contactLookup({ id: 10 }))
        .mockReturnValueOnce({
          insert: () =>
            Promise.resolve({ error: { message: "Insert failed" } }),
        });

      const response = await addNoteToContact(baseParams);

      expect(response).toBeInstanceOf(Response);
      expect(response!.status).toBe(500);
      expect(await response!.text()).toContain("Could not add note");
    });

    it("returns 500 when contact resolution fails", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);
      mockFrom.mockReturnValue(
        contactLookup(null, { message: "Contact DB error" }),
      );

      const response = await addNoteToContact(baseParams);

      expect(response).toBeInstanceOf(Response);
      expect(response!.status).toBe(500);
      expect(await response!.text()).toContain(
        "Could not get or create contact",
      );
      consoleSpy.mockRestore();
    });
  });
});
