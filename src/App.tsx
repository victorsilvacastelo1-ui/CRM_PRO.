import { CRM } from "@/components/atomic-crm/root/CRM";

/**
 * CRM Pro application entry point.
 *
 * The project is based on the MIT-licensed Atomic/Pata CRM codebase.
 * Product-specific customization lives here while the reusable CRM
 * components remain isolated under src/components/atomic-crm.
 */
const App = () => (
  <CRM
    title="CRM Pro"
    currency="BRL"
    disableTelemetry
  />
);

export default App;
