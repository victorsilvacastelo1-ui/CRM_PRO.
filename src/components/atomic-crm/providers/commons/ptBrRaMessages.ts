import type { TranslationMessages } from "ra-core";

export const ptBrRaMessages: TranslationMessages = {
  ra: {
    action: {
      add_filter: "Adicionar filtro",
      add: "Adicionar",
      back: "Voltar",
      bulk_actions:
        "1 item selecionado |||| %{smart_count} itens selecionados",
      cancel: "Cancelar",
      clear_array_input: "Limpar a lista",
      clear_input_value: "Limpar valor",
      clone: "Duplicar",
      confirm: "Confirmar",
      create: "Criar",
      create_item: "Criar %{item}",
      delete: "Excluir",
      edit: "Editar",
      export: "Exportar",
      list: "Listar",
      refresh: "Atualizar",
      remove_filter: "Remover este filtro",
      remove_all_filters: "Remover todos os filtros",
      remove: "Remover",
      reset: "Redefinir",
      save: "Salvar",
      search: "Pesquisar",
      clear_search: "Limpar pesquisa",
      search_columns: "Pesquisar colunas",
      select_all: "Selecionar tudo",
      select_all_button: "Selecionar tudo",
      select_row: "Selecionar esta linha",
      show: "Visualizar",
      sort: "Ordenar",
      undo: "Desfazer",
      unselect: "Desmarcar",
      expand: "Expandir",
      close: "Fechar",
      open_menu: "Abrir menu",
      close_menu: "Fechar menu",
      update: "Atualizar",
      move_up: "Mover para cima",
      move_down: "Mover para baixo",
      open: "Abrir",
      toggle_theme: "Alternar modo claro/escuro",
      select_columns: "Colunas",
      update_application: "Recarregar aplicativo",
    },
    boolean: {
      true: "Sim",
      false: "Não",
      null: " ",
    },
    page: {
      create: "Criar %{name}",
      dashboard: "Painel",
      edit: "%{name} %{recordRepresentation}",
      error: "Algo deu errado",
      list: "%{name}",
      loading: "Carregando",
      not_found: "Não encontrado",
      show: "%{name} %{recordRepresentation}",
      empty: "Ainda não há %{name}.",
      invite: "Deseja adicionar um?",
      access_denied: "Acesso negado",
      authentication_error: "Erro de autenticação",
    },
    input: {
      file: {
        upload_several:
          "Solte alguns arquivos aqui ou clique para selecioná-los.",
        upload_single: "Solte um arquivo aqui ou clique para selecioná-lo.",
      },
      image: {
        upload_several:
          "Solte algumas imagens aqui ou clique para selecioná-las.",
        upload_single: "Solte uma imagem aqui ou clique para selecioná-la.",
      },
      references: {
        all_missing: "Não foi possível localizar os dados de referência.",
        many_missing:
          "Pelo menos uma das referências associadas não está mais disponível.",
        single_missing: "A referência associada não está mais disponível.",
      },
      password: {
        toggle_visible: "Ocultar senha",
        toggle_hidden: "Mostrar senha",
      },
    },
    message: {
      about: "Sobre",
      access_denied: "Você não tem permissão para acessar esta página.",
      are_you_sure: "Tem certeza?",
      authentication_error:
        "O servidor de autenticação retornou um erro e não foi possível verificar suas credenciais.",
      auth_error:
        "Ocorreu um erro ao validar o token de autenticação.",
      bulk_delete_content:
        "Tem certeza de que deseja excluir este %{name}? |||| Tem certeza de que deseja excluir estes %{smart_count} itens?",
      bulk_delete_title:
        "Excluir %{name} |||| Excluir %{smart_count} %{name}",
      bulk_update_content:
        "Tem certeza de que deseja atualizar %{name} %{recordRepresentation}? |||| Tem certeza de que deseja atualizar estes %{smart_count} itens?",
      bulk_update_title:
        "Atualizar %{name} %{recordRepresentation} |||| Atualizar %{smart_count} %{name}",
      clear_array_input: "Tem certeza de que deseja limpar toda a lista?",
      delete_content: "Tem certeza de que deseja excluir este %{name}?",
      delete_title: "Excluir %{name} %{recordRepresentation}",
      details: "Detalhes",
      error:
        "Ocorreu um erro no aplicativo e não foi possível concluir a solicitação.",
      invalid_form: "O formulário contém erros. Revise os campos.",
      loading: "Aguarde",
      no: "Não",
      not_found:
        "O endereço pode estar incorreto ou o link acessado não existe.",
      select_all_limit_reached:
        "Há elementos demais para selecionar todos. Apenas os primeiros %{max} foram selecionados.",
      unsaved_changes:
        "Algumas alterações não foram salvas. Tem certeza de que deseja descartá-las?",
      yes: "Sim",
      placeholder_data_warning:
        "Problema de rede: não foi possível atualizar os dados.",
    },
    navigation: {
      clear_filters: "Limpar filtros",
      no_filtered_results:
        "Nenhum %{name} encontrado com os filtros atuais.",
      no_results: "Nenhum %{name} encontrado",
      no_more_results:
        "A página %{page} está fora dos limites. Tente a página anterior.",
      page_out_of_boundaries: "A página %{page} está fora dos limites",
      page_out_from_end: "Não é possível avançar após a última página",
      page_out_from_begin: "Não é possível voltar antes da página 1",
      page_range_info: "%{offsetBegin}-%{offsetEnd} de %{total}",
      partial_page_range_info:
        "%{offsetBegin}-%{offsetEnd} de mais de %{offsetEnd}",
      current_page: "Página %{page}",
      page: "Ir para a página %{page}",
      first: "Ir para a primeira página",
      last: "Ir para a última página",
      next: "Ir para a próxima página",
      previous: "Ir para a página anterior",
      page_rows_per_page: "Linhas por página:",
      skip_nav: "Ir para o conteúdo",
    },
    sort: {
      sort_by: "Ordenar por %{field_lower_first} %{order}",
      ASC: "crescente",
      DESC: "decrescente",
    },
    auth: {
      auth_check_error: "Faça login para continuar",
      user_menu: "Perfil",
      username: "Usuário",
      password: "Senha",
      email: "E-mail",
      sign_in: "Entrar",
      sign_in_error: "Falha na autenticação. Tente novamente.",
      logout: "Sair",
    },
    notification: {
      updated:
        "Item atualizado |||| %{smart_count} itens atualizados",
      created: "Item criado",
      deleted: "Item excluído |||| %{smart_count} itens excluídos",
      bad_item: "Item incorreto",
      item_doesnt_exist: "O item não existe",
      http_error: "Erro de comunicação com o servidor",
      data_provider_error:
        "Erro no provedor de dados. Consulte o console para obter detalhes.",
      i18n_error: "Não foi possível carregar as traduções do idioma.",
      canceled: "Ação cancelada",
      logged_out: "Sua sessão terminou. Entre novamente.",
      not_authorized: "Você não está autorizado a acessar este recurso.",
      application_update_available: "Uma nova versão está disponível.",
      offline: "Sem conexão. Não foi possível buscar os dados.",
    },
    validation: {
      required: "Obrigatório",
      minLength: "Deve ter pelo menos %{min} caracteres",
      maxLength: "Deve ter no máximo %{max} caracteres",
      minValue: "Deve ser no mínimo %{min}",
      maxValue: "Deve ser no máximo %{max}",
      number: "Deve ser um número",
      email: "Informe um e-mail válido",
      oneOf: "Deve ser uma destas opções: %{options}",
      regex: "Deve seguir o formato: %{pattern}",
      unique: "Deve ser único",
    },
    saved_queries: {
      label: "Consultas salvas",
      query_name: "Nome da consulta",
      new_label: "Salvar consulta atual...",
      new_dialog_title: "Salvar consulta atual como",
      remove_label: "Remover consulta salva",
      remove_label_with_name: 'Remover consulta "%{name}"',
      remove_dialog_title: "Remover consulta salva?",
      remove_message:
        "Tem certeza de que deseja remover este item das consultas salvas?",
      help: "Filtre a lista e salve esta consulta para usar depois",
    },
    guesser: {
      empty: {
        title: "Nenhum dado para exibir",
        message: "Verifique o provedor de dados",
      },
    },
    configurable: {
      customize: "Personalizar",
      configureMode: "Configurar esta página",
      inspector: {
        title: "Inspetor",
        content:
          "Passe o cursor sobre os elementos da interface para configurá-los",
        reset: "Redefinir configurações",
        hideAll: "Ocultar tudo",
        showAll: "Mostrar tudo",
      },
      Datagrid: {
        title: "Tabela",
        unlabeled: "Coluna sem rótulo #%{column}",
      },
      SimpleForm: {
        title: "Formulário",
        unlabeled: "Campo sem rótulo #%{input}",
      },
      SimpleList: {
        title: "Lista",
        primaryText: "Texto principal",
        secondaryText: "Texto secundário",
        tertiaryText: "Texto terciário",
      },
    },
  },
};

export default ptBrRaMessages;
