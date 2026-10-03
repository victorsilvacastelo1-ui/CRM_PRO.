# CRM Pro — Supabase remoto

Projeto Supabase dedicado ao CRM Pro:

- Project ref: `pulsssmguyfhnfsfukgm`
- URL: `https://pulsssmguyfhnfsfukgm.supabase.co`
- Região: `sa-east-1`

## Variáveis de ambiente do frontend

O deploy deve configurar:

- `VITE_SUPABASE_URL=https://pulsssmguyfhnfsfukgm.supabase.co`
- `VITE_SB_PUBLISHABLE_KEY=<publishable key do projeto CRM Pro>`
- `VITE_ATTACHMENTS_BUCKET=attachments`

A chave `service_role` nunca deve ser usada no frontend.

## Banco

As migrations da branch `develop` foram aplicadas ao projeto remoto e o histórico foi alinhado com os arquivos em `supabase/migrations`.

O Armazém Pro usa outro projeto Supabase e não deve ser usado por este repositório.
