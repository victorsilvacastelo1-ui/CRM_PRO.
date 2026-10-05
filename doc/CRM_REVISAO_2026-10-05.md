# CRM Pro — revisão de 5 de outubro de 2026

Base: GitHub `victorsilvacastelo1-ui/CRM_PRO.`, commit 32248a4.
O ZIP anterior era mais antigo que o repositório. O site público e as páginas
legais foram copiados da versão publicada para preservar o conteúdo atual.

## Alterações

- Recuperação, convite e confirmação passam por um retorno de autenticação
  validado. O endereço legado `/sistema/auth-callback.html` deixa de abrir uma
  tela comum do CRM sem processar os tokens.
- Cadastro e recuperação informam explicitamente o endereço de retorno.
- Links inválidos ou expirados mostram uma explicação e a opção de solicitar
  outro link. A senha exige no mínimo oito caracteres e confirmação igual.
- O perfil e as permissões são consultados no servidor, sem confiar no perfil
  antigo guardado no navegador. Dados comerciais do modo móvel deixam de ser
  persistidos entre contas; o cache antigo é removido.
- Formulários de criação e edição de usuários aguardam a resposta antes de
  liberar o botão; a lista é atualizada depois de salvar.
- O menu Novidades foi removido do código-fonte, preservando o pedido anterior.
- O empacotamento inclui apresentação na raiz, sistema, páginas legais,
  compatibilidade dos links antigos e cache dos arquivos da versão correta.

## Banco de produção

Foi aplicada a migração `restrict_internal_delete_trigger_execution`, que retira
EXECUTE de PUBLIC, anon e authenticated na função interna `handle_delete_user()`.
Consulta posterior confirmou as duas permissões desativadas e o gatilho preservado.
O verificador de segurança deixou de apontar esses dois avisos. Permanece o aviso
sobre proteção de senhas vazadas desativada; isso é uma configuração do serviço.
Nenhum usuário ou registro de cliente foi excluído durante esta revisão.

## Validação

- 19 testes automatizados de sessão, permissões e retorno de autenticação.
- 10 testes de compatibilidade e segurança dos redirecionamentos.
- TypeScript e compilação de produção concluídos.
- ESLint nos arquivos alterados, sem erros.
- O navegador de testes não pôde ser instalado neste ambiente (download inválido).
  Portanto não houve validação visual nem login em uma conta real nesta rodada.
- Não foram enviados convites ou e-mails reais. A entrega por SMTP, o aceite de
  convite, a troca de senha com um e-mail real e exclusões reais de usuários
  permanecem como validações de ponta a ponta para a publicação.

## Publicação

`npm ci` e `npm run build:netlify` geram `dist` com apresentação e sistema.
Configurar VITE_SUPABASE_URL, VITE_SB_PUBLISHABLE_KEY, VITE_IS_DEMO=false e
VITE_ATTACHMENTS_BUCKET=attachments no ambiente de build. Nunca usar service_role.
O endereço de retorno `/sistema/auth-callback.html` deve estar autorizado no Auth.

O pacote desta revisão está preparado; a nova interface não foi publicada
automaticamente. A alteração de permissão acima já está aplicada no banco.
