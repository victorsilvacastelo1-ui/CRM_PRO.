import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Welcome = () => (
  <Card>
    <CardHeader className="px-4">
      <CardTitle>Seu CRM Pro</CardTitle>
    </CardHeader>
    <CardContent className="px-4">
      <p className="text-sm mb-4">
        <a
          href="https://marmelab.com/atomic-crm"
          className="underline hover:no-underline"
        >
          Atomic CRM
        </a>{" "}
        é a base do CRM Pro para organizar clientes, contatos, negociações e tarefas.
      </p>
      <p className="text-sm mb-4">
        This demo runs on a mock API, so you can explore and modify the data. It
        resets on reload. The full version uses Supabase for the backend.
      </p>
      <p className="text-sm">
        Powered by{" "}
        <a
          href="https://marmelab.com/shadcn-admin-kit"
          className="underline hover:no-underline"
        >
          shadcn-admin-kit
        </a>
         e a base Atomic CRM são projetos de código aberto. A base original está em{" "}
        <a
          href="https://github.com/marmelab/atomic-crm"
          className="underline hover:no-underline"
        >
          marmelab/atomic-crm
        </a>
        .
      </p>
    </CardContent>
  </Card>
);
