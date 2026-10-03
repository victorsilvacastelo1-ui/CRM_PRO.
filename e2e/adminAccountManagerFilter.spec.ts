import { expect, test } from "./fixtures";

test.describe("admin filtering by account manager", () => {
  test.beforeEach(async ({ createSales, createCompany, createContact }) => {
    const admin = await createSales({
      administrator: true,
      email: "john@doe.com",
      first_name: "John",
      last_name: "Doe",
      password: "password",
    });

    const teammate = await createSales({
      email: "marie@curie.com",
      first_name: "Marie",
      last_name: "Curie",
      password: "password",
      organization_id: admin.organization_id,
    });

    const company = await createCompany({
      name: "Smith Corp",
      salesId: admin.id,
    });

    await createContact({
      company_id: company.id,
      first_name: "Ada",
      last_name: "Lovelace",
      sales_id: admin.id,
      title: "CTO",
    });

    await createContact({
      company_id: company.id,
      first_name: "Grace",
      last_name: "Hopper",
      sales_id: teammate.id,
      title: "Rear Admiral",
    });
  });

  test("admin narrows the contact list down to a teammate's contacts", async ({
    page,
    isMobile,
    menu,
  }) => {
    await page.goto("/");
    await page.getByLabel("E-mail").fill("john@doe.com");
    await page.getByLabel("Senha").fill("password");
    await page.getByRole("button", { name: "Entrar" }).click();

    await menu.goToContacts();
    await expect(page.getByText("Ada Lovelace")).toBeVisible();
    await expect(page.getByText("Grace Hopper")).toBeVisible();

    if (isMobile) {
      await page.getByRole("button", { name: "Adicionar filtro" }).click();
    }
    await page.getByRole("button", { name: "Marie Curie" }).click();
    if (isMobile) {
      await page.getByRole("button", { name: "Confirmar" }).click();
    }

    await expect(page.getByText("Grace Hopper")).toBeVisible();
    await expect(page.getByText("Ada Lovelace")).toBeHidden();

    if (isMobile) {
      await page.getByRole("button", { name: "Adicionar filtro" }).click();
    }
    await page.getByRole("button", { name: "Marie Curie" }).click();
    if (isMobile) {
      await page.getByRole("button", { name: "Confirmar" }).click();
    }

    await expect(page.getByText("Ada Lovelace")).toBeVisible();
    await expect(page.getByText("Grace Hopper")).toBeVisible();
  });

  test("a non-admin user gets no account manager list", async ({
    page,
    isMobile,
    menu,
  }) => {
    await page.goto("/");
    await page.getByLabel("E-mail").fill("marie@curie.com");
    await page.getByLabel("Senha").fill("password");
    await page.getByRole("button", { name: "Entrar" }).click();

    await menu.goToContacts();
    await expect(page.getByText("Grace Hopper")).toBeVisible();

    if (isMobile) {
      await page.getByRole("button", { name: "Adicionar filtro" }).click();
    }
    await expect(
      page.getByRole("button", { name: "Eu", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "John Doe" })).toBeHidden();
  });
});
