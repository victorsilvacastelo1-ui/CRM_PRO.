import { mergeTranslations } from "ra-core";
import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "ra-language-english";
import { raSupabaseEnglishMessages } from "ra-supabase-language-english";
import { englishCrmMessages } from "./englishCrmMessages";
import { ptBrRaMessages } from "./ptBrRaMessages";
import { ptBrSupabaseMessages } from "./ptBrSupabaseMessages";
import { portugueseCrmMessages } from "./portugueseCrmMessages";

const portugueseCatalog = mergeTranslations(
  englishMessages,
  raSupabaseEnglishMessages,
  englishCrmMessages,
  ptBrRaMessages,
  ptBrSupabaseMessages,
  portugueseCrmMessages,
);

export const getInitialLocale = (): "pt-BR" => "pt-BR";

export const i18nProvider = polyglotI18nProvider(
  () => portugueseCatalog,
  "pt-BR",
  [{ locale: "pt-BR", name: "Português (Brasil)" }],
  { allowMissing: true },
);

export const testI18nProvider = polyglotI18nProvider(
  () => portugueseCatalog,
  "pt-BR",
  [{ locale: "pt-BR", name: "Português (Brasil)" }],
  { allowMissing: true },
);
