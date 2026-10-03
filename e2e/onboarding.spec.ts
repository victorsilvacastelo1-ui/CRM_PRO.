import { test, expect } from "./fixtures";

test("user onboarding", async ({ page, isMobile, menu, dismissToast }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/CRM Pro/);
  await page.getByRole("link", { name: "Criar conta no CRM Pro" }).click();
  await expect(page.getByText("Crie sua conta no CRM Pro")).toBeVisible();

  await page.getByLabel("Nome da empresa").fill("Doe Serviços");
  await page.getByLabel("Nome").fill("John");
  await page.getByLabel("Sobrenome").fill("Doe");
  await page.getByLabel("E-mail").fill("john@doe.com");
  await page.getByLabel("Senha").fill("password");
  await page.getByRole("button", { name: "Criar conta" }).click();

  await expect(page.getByText("Próximo passo")).toBeVisible();
  await expect(page.getByText("1/3 concluído")).toBeVisible();
  await expect(page.getByText("Configurar CRM Pro")).toBeVisible();
  await expect(page.getByText("Adicionar primeiro contato")).toBeVisible();
  await expect(page.getByText("Adicionar primeira nota")).toBeVisible();
  await expect(page.getByRole("button", { name: "Importar dados" })).toBeVisible();

  await page
    .getByRole(isMobile ? "button" : "link", { name: "Adicionar contato" })
    .click();
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Feminino").click();
  await page.getByLabel("Nome").fill("Jane");
  await page.getByLabel("Sobrenome").fill("Smith");
  await page.getByLabel("Title").fill("CEO");
  await page.getByLabel("Empresa").click();
  await page.getByPlaceholder("Pesquisar").fill("Smith Corp");
  await page.getByText("Criar Smith Corp").click();
  await page
    .getByRole("group", { name: "E-mails" })
    .getByRole("textbox", { name: "E-mail" })
    .fill("jane@smithcorp.com");
  await page
    .getByRole("group", { name: "E-mails" })
    .getByRole("button", { name: "Adicionar" })
    .click();

  await page
    .getByRole("group", { name: "Telefones" })
    .getByRole("textbox", { name: "Telefone" })
    .fill("+1234567890");
  await page
    .getByRole("group", { name: "Telefones" })
    .getByRole("button", { name: "Adicionar" })
    .click();

  await page
    .getByLabel("LinkedIn URL")
    .fill("https://www.linkedin.com/in/jane-smith");

  await page
    .getByLabel("Contexto (biografia, como conheceu, observações etc.)")
    .fill("Met at a conference.");

  await page.getByLabel("Recebe newsletter").check();

  await expect(page.getByLabel("Responsável *")).toHaveText("John Doe");

  await page.getByRole("button", { name: "Salvar" }).click();

  await dismissToast("Item criado");

  await expect(page.locator(isMobile ? "h2" : "h5")).toHaveText("Jane Smith");
  await expect(page.getByText("CEO em Smith Corp")).toBeVisible();

  await menu.goToDashboard();
  await page.waitForLoadState("networkidle");

  await expect(page.getByText("2/3 concluído")).toBeVisible();

  await page
    .getByRole(isMobile ? "button" : "link", { name: "Adicionar nota" })
    .click();

  await page.waitForLoadState("networkidle");

  await page.getByPlaceholder("Adicionar uma nota").fill("This is a note about Jane.");
  await page
    .getByRole("button", { name: isMobile ? "Salvar" : "Adicionar esta nota" })
    .click();

  await dismissToast("Nota adicionada");

  await expect(
    page.getByText(isMobile ? "Eu" : "Você adicionou uma nota", { exact: false }),
  ).toBeVisible();
  await expect(page.getByText("This is a note about Jane.")).toBeVisible();

  await menu.goToDashboard();

  await page.waitForLoadState("networkidle");

  await expect(page.getByText("Atividades recentes")).toBeVisible();
  await expect(
    page.getByText("Atividades recentes").locator("xpath=../.."),
  ).toHaveText(/Você adicionou a empresa Smith Corp/);

  await expect(
    page.getByText("Atividades recentes").locator("xpath=../.."),
  ).toHaveText(/Você adicionou Jane Smith.*Smith Corp/);

  await expect(
    page.getByText("Atividades recentes").locator("xpath=../.."),
  ).toHaveText(/Você adicionou uma nota sobre Jane Smith/);
});
