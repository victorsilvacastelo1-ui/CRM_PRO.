import type { ConfigurationContextValue } from "./ConfigurationContext";
import crmProIcon from "./logos/crm_pro_icon.png";

export const defaultDarkModeLogo = crmProIcon;
export const defaultLightModeLogo = crmProIcon;

export const defaultCurrency = "BRL";

export const defaultTitle = "CRM Pro";

export const defaultCompanySectors = [
  { value: "communication-services", label: "Serviços de comunicação" },
  { value: "consumer-discretionary", label: "Consumo discricionário" },
  { value: "consumer-staples", label: "Bens de consumo essenciais" },
  { value: "energy", label: "Energia" },
  { value: "financials", label: "Financeiro" },
  { value: "health-care", label: "Saúde" },
  { value: "industrials", label: "Indústria" },
  { value: "information-technology", label: "Tecnologia da informação" },
  { value: "materials", label: "Materiais" },
  { value: "real-estate", label: "Imobiliário" },
  { value: "utilities", label: "Serviços públicos" },
  { value: "construction", label: "Construção" },
  { value: "commerce", label: "Comércio" },
  { value: "services", label: "Serviços" },
  { value: "education", label: "Educação" },
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
  { value: "other", label: "Outro" },
  { value: "copywriting", label: "Redação / Copywriting" },
  { value: "print-project", label: "Projeto gráfico" },
  { value: "ui-design", label: "Design de interface" },
  { value: "website-design", label: "Criação de site" },
  { value: "product", label: "Produto" },
  { value: "service", label: "Serviço" },
  { value: "subscription", label: "Assinatura" },
  { value: "project", label: "Projeto" },
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
