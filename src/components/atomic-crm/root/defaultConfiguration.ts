import type { ConfigurationContextValue } from "./ConfigurationContext";
// Keep upstream logo assets until a dedicated CRM Pro brand kit is added.
import darkModeLogo from "./logos/logo_atomic_crm_dark.svg";
import lightModeLogo from "./logos/logo_atomic_crm_light.svg";

export const defaultDarkModeLogo = darkModeLogo;
export const defaultLightModeLogo = lightModeLogo;

export const defaultCurrency = "BRL";

export const defaultTitle = "CRM Pro";

export const defaultCompanySectors = [
  { value: "construction", label: "Construção" },
  { value: "commerce", label: "Comércio" },
  { value: "services", label: "Serviços" },
  { value: "industry", label: "Indústria" },
  { value: "technology", label: "Tecnologia" },
  { value: "real-estate", label: "Imobiliário" },
  { value: "health-care", label: "Saúde" },
  { value: "education", label: "Educação" },
  { value: "financials", label: "Financeiro" },
  { value: "logistics", label: "Logística" },
  { value: "other", label: "Outros" },
];

export const defaultDealStages = [
  { value: "opportunity", label: "Oportunidade" },
  { value: "proposal-sent", label: "Proposta enviada" },
  { value: "in-negociation", label: "Em negociação" },
  { value: "won", label: "Ganho" },
  { value: "lost", label: "Perdido" },
  { value: "delayed", label: "Adiado" },
];

export const defaultDealPipelineStatuses = ["won"];

export const defaultDealCategories = [
  { value: "product", label: "Produto" },
  { value: "service", label: "Serviço" },
  { value: "subscription", label: "Assinatura" },
  { value: "project", label: "Projeto" },
  { value: "other", label: "Outro" },
];

export const defaultNoteStatuses = [
  { value: "cold", label: "Frio", color: "#7dbde8" },
  { value: "warm", label: "Morno", color: "#e8cb7d" },
  { value: "hot", label: "Quente", color: "#e88b7d" },
  { value: "in-contract", label: "Em contrato", color: "#a4e87d" },
];

export const defaultTaskTypes = [
  { value: "none", label: "Sem tipo" },
  { value: "email", label: "E-mail" },
  { value: "demo", label: "Demonstração" },
  { value: "lunch", label: "Almoço" },
  { value: "meeting", label: "Reunião" },
  { value: "follow-up", label: "Acompanhamento" },
  { value: "thank-you", label: "Agradecimento" },
  { value: "ship", label: "Envio" },
  { value: "call", label: "Ligação" },
];

export const defaultConfiguration: ConfigurationContextValue = {
  companySectors: defaultCompanySectors,
  currency: defaultCurrency,
  dealCategories: defaultDealCategories,
  dealPipelineStatuses: defaultDealPipelineStatuses,
  dealStages: defaultDealStages,
  noteStatuses: defaultNoteStatuses,
  taskTypes: defaultTaskTypes,
  title: defaultTitle,
  darkModeLogo: defaultDarkModeLogo,
  lightModeLogo: defaultLightModeLogo,
};
