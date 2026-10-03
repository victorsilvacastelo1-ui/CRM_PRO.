import defaultMessages from "ra-language-english";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { mergeTranslations } from "ra-core";
import { ptBrRaMessages } from "@/components/atomic-crm/providers/commons/ptBrRaMessages";

const messages = mergeTranslations(defaultMessages, ptBrRaMessages);

export const i18nProvider = polyglotI18nProvider(
  () => messages,
  "pt-BR",
  [{ locale: "pt-BR", name: "Português (Brasil)" }],
  { allowMissing: true },
);
