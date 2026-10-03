import { describe, expect, it } from "vitest";
import { getInitialLocale, i18nProvider } from "./i18nProvider";

describe("i18nProvider", () => {
  it("registers only Brazilian Portuguese", () => {
    expect(i18nProvider.getLocales?.()).toEqual([
      { locale: "pt-BR", name: "Português (Brasil)" },
    ]);
  });

  it("uses pt-BR as the initial locale", () => {
    expect(getInitialLocale()).toBe("pt-BR");
  });

  it("translates CRM keys to Brazilian Portuguese", () => {
    expect(i18nProvider.translate("crm.language")).toBe("Idioma");
    expect(i18nProvider.translate("resources.deals.empty.title")).toBe(
      "Nenhuma negociação encontrada",
    );
  });

  it("translates React Admin actions", () => {
    expect(i18nProvider.translate("ra.action.save")).toBe("Salvar");
    expect(i18nProvider.translate("ra.auth.sign_in")).toBe("Entrar");
  });

  it("translates Supabase authentication messages", () => {
    expect(i18nProvider.translate("ra-supabase.auth.forgot_password")).toBe(
      "Esqueci minha senha",
    );
    expect(i18nProvider.translate("ra-supabase.auth.password_reset")).toBe(
      "Sua senha foi redefinida. Verifique seu e-mail para continuar o acesso.",
    );
  });
});
