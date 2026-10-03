# CRM Pro — plano de transformação SaaS

Este documento registra as mudanças necessárias para transformar a base Atomic/Pata CRM em um SaaS multiempresa seguro.

## Estado atual da base

A aplicação original foi desenhada para uma instalação única. O cadastro inicial cria o primeiro usuário administrador e os demais usuários pertencem à mesma instalação.

As políticas RLS atuais permitem acesso global aos registros para qualquer usuário autenticado. Isso é adequado para uma instalação única, mas **não é adequado para um SaaS com várias empresas clientes**.

## Prioridade 1 — isolamento multiempresa

Antes de publicar para clientes:

1. Criar a tabela `organizations`.
2. Criar a tabela `organization_members` ligando usuários a empresas.
3. Adicionar `organization_id` às entidades de negócio:
   - companies
   - contacts
   - contact_notes
   - deals
   - deal_notes
   - sales
   - tags
   - tasks
   - configuration
4. Substituir as políticas RLS globais por políticas baseadas em associação à organização.
5. Garantir que inserts recebam a organização do usuário no servidor, sem confiar no frontend.
6. Isolar arquivos do Storage por organização.
7. Adaptar Edge Functions para validar a organização do usuário antes de ler ou alterar dados.
8. Criar testes automatizados provando que um usuário da Empresa A não consegue ler, alterar ou excluir dados da Empresa B.

## Prioridade 2 — onboarding SaaS

O fluxo original permite apenas um cadastro inicial por instalação. No CRM Pro deverá ser:

cadastro -> criação da empresa -> usuário proprietário -> período de teste -> convite de equipe -> assinatura.

## Prioridade 3 — localização Brasil

- pt-BR como idioma principal.
- BRL como moeda padrão.
- campos de CNPJ/CPF quando aplicável.
- telefone no padrão brasileiro.
- endereço com CEP, cidade e UF.
- datas no formato brasileiro.

## Prioridade 4 — comercial

- trial.
- planos e limites.
- assinatura.
- painel administrativo do CRM Pro.
- bloqueio controlado por status da assinatura.
- logs de auditoria.

## Regra de segurança

Nenhuma implantação para clientes deve ocorrer enquanto os testes de isolamento multiempresa não passarem.
