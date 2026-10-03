import { expect, test } from "./fixtures";

test.describe("user adding a task", () => {
  test.beforeEach(async ({ createSales, createContact, createCompany }) => {
    const sales = await createSales({
      first_name: "John",
      last_name: "Doe",
      email: "john@doe.com",
      password: "password",
    });

    const company = await createCompany({
      name: "Smith Corp",
      salesId: sales.id,
    });

    await createContact({
      first_name: "Jane",
      last_name: "Smith",
      title: "CEO",
      sales_id: sales.id,
      company_id: company.id,
      notes: [{ text: "Met at a conference." }],
    });

    await createContact({
      first_name: "Bob",
      last_name: "Johnson",
      title: "CTO",
      sales_id: sales.id,
      company_id: company.id,
    });

    await createContact({
      first_name: "Alice",
      last_name: "Williams",
      title: "CFO",
      sales_id: sales.id,
      company_id: company.id,
    });
  });
  test("user adding a task", async ({ page, isMobile, menu, dismissToast }) => {
    await page.goto("/");
    await page.getByLabel("E-mail").fill("john@doe.com");
    await page.getByLabel("Senha").fill("password");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveTitle(/CRM Pro/);
    await expect(page.getByText("Atividades recentes")).toBeVisible();

    await menu.goToContacts();
    await page.waitForLoadState("networkidle");

    await page.getByText("Jane Smith").click();
    await page.waitForLoadState("networkidle");

    if (isMobile) {
      await page.getByRole("button", { name: "Criar" }).click();
      await page.getByRole("menuitem", { name: "Tarefa" }).click();
    } else {
      await page.getByRole("button", { name: "Adicionar tarefa" }).click();
    }
    await page.getByLabel("Descrição *").fill("Follow up with Jane");
    await page.getByLabel("Data de vencimento").fill("2026-04-11T21:00");
    await page.getByLabel("Tipo").click();
    await page.getByRole("option", { name: "Ligação" }).click();

    await page.getByRole("button", { name: "Salvar" }).click();

    await dismissToast("Tarefa adicionada");

    if (isMobile) {
      await expect(page.getByText("1 tarefa")).toBeVisible();
      await page.getByText("1 tarefa").click();

      await expect(page.getByText("Follow up with Jane")).toBeVisible();
      await expect(page.getByText(/11\/04\/2026|11 de abril de 2026/)).toBeVisible();
    } else {
      await expect(page.getByText("Tarefas")).toBeVisible();

      await expect(page.getByText("Tarefas").locator("..")).toHaveText(
        /Follow up with Jane/,
      );
      await menu.goToDashboard();

      await expect(page.getByText("Próximas tarefas")).toBeVisible();
      await expect(
        page.getByText("Próximas tarefas").locator("../.."),
      ).toHaveText(/Follow up with Jane/);
      await expect(
        page.getByText("Follow up with Jane").locator(".."),
      ).toContainText("Ligação");
    }
  });
});
