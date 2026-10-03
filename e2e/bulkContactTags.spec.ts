import { test, expect } from "./fixtures";

test("user adds a tag to several contacts", async ({
  page,
  isMobile,
  createContact,
  createSales,
  menu,
  dismissToast,
}) => {
  test.skip(isMobile, "Bulk tag is only available on desktop");

  const sales = await createSales({
    email: "john@doe.com",
    first_name: "John",
    last_name: "Doe",
    password: "password",
  });

  await createContact({
    first_name: "Ada",
    last_name: "Lovelace",
    sales_id: sales.id,
    title: "CTO",
  });
  await createContact({
    first_name: "Grace",
    last_name: "Hopper",
    sales_id: sales.id,
    title: "Rear Admiral",
  });

  await page.goto("/");

  await page.getByLabel("E-mail").fill("john@doe.com");
  await page.getByLabel("Senha").fill("password");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveTitle(/CRM Pro/);
  await expect(page.getByRole("link", { name: "Contatos" })).toBeVisible();

  await menu.goToContacts();
  await expect(page.getByText("Ada Lovelace")).toBeVisible();
  await expect(page.getByText("Grace Hopper")).toBeVisible();

  const checkboxes = page.getByRole("checkbox");
  await checkboxes.nth(1).click();
  await page.getByRole("button", { name: /selecionar tudo/i }).click();

  await page.getByRole("button", { name: /^Etiqueta$/ }).click();
  await page.getByRole("button", { name: "Criar nova etiqueta" }).click();
  await page.getByLabel("Nome da etiqueta").fill("Prospect");
  await page.getByRole("button", { name: "Salvar" }).click();

  await dismissToast("Etiqueta adicionada a 2 contatos");

  await expect(
    page.getByText("Grace Hopper").locator("xpath=ancestor::a[1]"),
  ).toContainText("Prospect");
  await expect(
    page.getByText("Ada Lovelace").locator("xpath=ancestor::a[1]"),
  ).toContainText("Prospect");
});
