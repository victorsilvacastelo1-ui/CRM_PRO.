import type { CrmMessages } from "./englishCrmMessages";

export const portugueseCrmMessages = {
  resources: {
    companies: {
      name: "Empresa |||| Empresas",
      forcedCaseName: "Empresa",
      fields: {
        name: "Nome da empresa",
        website: "Site",
        linkedin_url: "URL do LinkedIn",
        phone_number: "Telefone",
        created_at: "Criada em",
        nb_contacts: "Número de contatos",
        revenue: "Receita",
        sector: "Setor",
        size: "Porte",
        tax_identifier: "CNPJ/CPF",
        address: "Endereço",
        city: "Cidade",
        zipcode: "CEP",
        state_abbr: "UF",
        country: "País",
        description: "Descrição",
        context_links: "Links de contexto",
        sales_id: "Responsável",
      },
      empty: {
        description: "Sua lista de empresas está vazia.",
        title: "Nenhuma empresa encontrada",
      },
      import: {
        title: "Importar empresas",
      },
      field_categories: {
        contact: "Contato",
        additional_info: "Informações adicionais",
        address: "Endereço",
        context: "Contexto",
      },
      action: {
        create: "Criar empresa",
        edit: "Editar empresa",
        new: "Nova empresa",
        show: "Visualizar empresa",
      },
      added_on: "Adicionada em %{date}",
      followed_by: "Acompanhada por %{name}",
      followed_by_you: "Acompanhada por você",
      no_contacts: "Nenhum contato",
      nb_contacts: "%{smart_count} contato |||| %{smart_count} contatos",
      nb_deals: "%{smart_count} negociação |||| %{smart_count} negociações",
      sizes: {
        one_employee: "1 funcionário",
        two_to_nine_employees: "2 a 9 funcionários",
        ten_to_forty_nine_employees: "10 a 49 funcionários",
        fifty_to_two_hundred_forty_nine_employees:
          "50 a 249 funcionários",
        two_hundred_fifty_or_more_employees: "250 ou mais funcionários",
      },
      autocomplete: {
        create_error: "Ocorreu um erro ao criar a empresa",
        create_item: "Criar %{item}",
        create_label: "Digite para criar uma nova empresa",
      },
    },
    contacts: {
      name: "Contato |||| Contatos",
      forcedCaseName: "Contato",
      field_categories: {
        background_info: "Informações de contexto",
        identity: "Identificação",
        misc: "Outros",
        personal_info: "Informações pessoais",
        position: "Cargo",
      },
      fields: {
        first_name: "Nome",
        last_name: "Sobrenome",
        last_seen: "Último contato",
        title: "Cargo",
        company_id: "Empresa",
        email_jsonb: "E-mails",
        email: "E-mail",
        phone_jsonb: "Telefones",
        phone_number: "Telefone",
        linkedin_url: "URL do LinkedIn",
        background: "Contexto (biografia, como conheceu, observações etc.)",
        has_newsletter: "Recebe newsletter",
        sales_id: "Responsável",
      },
      action: {
        add: "Adicionar contato",
        add_first: "Adicionar primeiro contato",
        create: "Criar contato",
        edit: "Editar contato",
        export_vcard: "Exportar vCard",
        new: "Novo contato",
        show: "Visualizar contato",
      },
      background: {
        last_activity_on: "Última atividade em %{date}",
        added_on: "Adicionado em %{date}",
        followed_by: "Acompanhado por %{name}",
        followed_by_you: "Acompanhado por você",
        status_none: "Nenhum",
      },
      position_at: "%{title} em",
      position_at_company: "%{title} em %{company}",
      empty: {
        description: "Sua lista de contatos está vazia.",
        title: "Nenhum contato encontrado",
      },
      import: {
        title: "Importar contatos",
      },
      inputs: {
        genders: {
          male: "Masculino",
          female: "Feminino",
          nonbinary: "Outro",
        },
        personal_info_types: {
          work: "Trabalho",
          home: "Pessoal",
          other: "Outro",
        },
      },
      list: {
        error_loading: "Erro ao carregar contatos",
      },
      bulk_tag: {
        action: "Etiqueta",
        back: "Voltar para etiquetas",
        create_description:
          "Crie uma nova etiqueta e aplique aos contatos selecionados.",
        description:
          "Escolha uma etiqueta existente ou crie uma nova para os contatos selecionados.",
        empty:
          "Ainda não há etiquetas. Crie uma para marcar os contatos selecionados.",
        error: "Não foi possível adicionar a etiqueta aos contatos",
        noop: "Os contatos selecionados já possuem esta etiqueta",
        success:
          "Etiqueta adicionada a %{smart_count} contato |||| Etiqueta adicionada a %{smart_count} contatos",
        title: "Adicionar etiqueta aos contatos",
      },
      merge: {
        action: "Mesclar com outro contato",
        confirm: "Mesclar contatos",
        current_contact: "Contato atual (será excluído)",
        description: "Mescle este contato com outro.",
        error: "Não foi possível mesclar os contatos",
        merging: "Mesclando...",
        no_additional_data: "Não há dados adicionais para mesclar",
        select_target: "Selecione o contato que receberá os dados",
        success: "Contatos mesclados com sucesso",
        target_contact: "Contato de destino (será mantido)",
        title: "Mesclar contato",
        warning_description:
          "Todos os dados serão transferidos para o segundo contato. Esta ação não pode ser desfeita.",
        warning_title: "Atenção: operação irreversível",
        what_will_be_merged: "Dados que serão mesclados:",
      },
      filters: {
        before_last_month: "Antes do mês passado",
        before_this_month: "Antes deste mês",
        before_this_week: "Antes desta semana",
        managed_by_me: "Gerenciados por mim",
        search: "Pesquisar nome, empresa...",
        this_week: "Esta semana",
        today: "Hoje",
        tags: "Etiquetas",
        tasks: "Tarefas",
      },
      hot: {
        empty_change_status:
          'Altere o status de um contato adicionando uma nota e clicando em "mostrar opções".',
        empty_hint: 'Contatos com status "Quente" aparecerão aqui.',
        title: "Contatos quentes",
      },
    },
    deals: {
      name: "Negociação |||| Negociações",
      fields: {
        name: "Nome",
        description: "Descrição",
        company_id: "Empresa",
        contact_ids: "Contatos",
        category: "Categoria",
        amount: "Valor",
        expected_closing_date: "Previsão de fechamento",
        stage: "Etapa",
      },
      action: {
        back_to_deal: "Voltar para negociação",
        create: "Criar negociação",
        new: "Nova negociação",
      },
      field_categories: {
        misc: "Outros",
      },
      filters: {
        only_mine: "Somente negociações que gerencio",
      },
      archived: {
        action: "Arquivar",
        error: "Erro: negociação não arquivada",
        list_title: "Negociações arquivadas",
        success: "Negociação arquivada",
        title: "Negociação arquivada",
        view: "Ver negociações arquivadas",
      },
      inputs: {
        linked_to: "Vinculado a",
      },
      unarchived: {
        action: "Voltar para o funil",
        error: "Erro: negociação não restaurada",
        success: "Negociação restaurada",
      },
      updated: "Negociação atualizada",
      empty: {
        before_create: "antes de criar uma negociação.",
        description: "Sua lista de negociações está vazia.",
        title: "Nenhuma negociação encontrada",
      },
      import: {
        title: "Importar negociações",
      },
      invalid_date: "Data inválida",
    },
    notes: {
      name: "Nota |||| Notas",
      forcedCaseName: "Nota",
      fields: {
        status: "Status",
        date: "Data",
        attachments: "Anexos",
        contact_id: "Contato",
        deal_id: "Negociação",
      },
      action: {
        add: "Adicionar nota",
        add_first: "Adicionar primeira nota",
        delete: "Excluir nota",
        edit: "Editar nota",
        update: "Atualizar nota",
        add_this: "Adicionar esta nota",
      },
      sheet: {
        create: "Criar nota",
        create_for: "Criar nota para %{name}",
        edit: "Editar nota",
        edit_for: "Editar nota de %{name}",
      },
      deleted: "Nota excluída",
      empty: "Ainda não há notas",
      author_added: "%{name} adicionou uma nota",
      you_added: "Você adicionou uma nota",
      me: "Eu",
      list: {
        error_loading: "Erro ao carregar notas",
      },
      note_for_contact: "Nota para %{name}",
      stepper: {
        hint: "Abra um contato e adicione uma nota",
      },
      added: "Nota adicionada",
      inputs: {
        add_note: "Adicionar uma nota",
        options_hint: "(anexar arquivos ou alterar detalhes)",
        show_options: "Mostrar opções",
      },
      actions: {
        attach_document: "Anexar documento",
      },
      validation: {
        note_or_attachment_required: "Informe uma nota ou adicione um anexo",
      },
    },
    sales: {
      name: "Usuário |||| Usuários",
      fields: {
        first_name: "Nome",
        last_name: "Sobrenome",
        email: "E-mail",
        secondary_email: "E-mail secundário",
        secondary_emails: "E-mails secundários",
        administrator: "Administrador",
        disabled: "Desativado",
      },
      create: {
        error: "Ocorreu um erro ao criar o usuário.",
        success:
          "Usuário criado. Ele receberá um e-mail para definir a senha.",
        title: "Criar novo usuário",
      },
      edit: {
        error: "Ocorreu um erro. Tente novamente.",
        record_not_found: "Registro não encontrado",
        success: "Usuário atualizado com sucesso",
        title: "Editar %{name}",
      },
      action: {
        new: "Novo usuário",
      },
    },
    tasks: {
      name: "Tarefa |||| Tarefas",
      forcedCaseName: "Tarefa",
      fields: {
        text: "Descrição",
        due_date: "Data de vencimento",
        type: "Tipo",
        contact_id: "Contato",
        due_short: "vence",
      },
      action: {
        add: "Adicionar tarefa",
        create: "Criar tarefa",
        edit: "Editar tarefa",
      },
      actions: {
        postpone_next_week: "Adiar para a próxima semana",
        postpone_tomorrow: "Adiar para amanhã",
        title: "Ações da tarefa",
      },
      added: "Tarefa adicionada",
      deleted: "Tarefa excluída com sucesso",
      dialog: {
        create: "Criar tarefa",
        create_for: "Criar tarefa para %{name}",
      },
      sheet: {
        edit: "Editar tarefa",
        edit_for: "Editar tarefa de %{name}",
      },
      empty: "Ainda não há tarefas",
      empty_list_hint: "As tarefas dos seus contatos aparecerão aqui.",
      filters: {
        later: "Mais tarde",
        overdue: "Atrasadas",
        this_week: "Esta semana",
        today: "Hoje",
        tomorrow: "Amanhã",
        with_pending: "Com tarefas pendentes",
      },
      regarding_contact: "(Sobre: %{name})",
      updated: "Tarefa atualizada",
    },
    tags: {
      name: "Etiqueta |||| Etiquetas",
      action: {
        add: "Adicionar etiqueta",
        create: "Criar nova etiqueta",
      },
      dialog: {
        color: "Cor",
        create_title: "Criar nova etiqueta",
        edit_title: "Editar etiqueta",
        name_label: "Nome da etiqueta",
        name_placeholder: "Digite o nome da etiqueta",
      },
    },
  },
  crm: {
    action: {
      reset_password: "Redefinir senha",
    },
    auth: {
      first_name: "Nome",
      last_name: "Sobrenome",
      confirm_password: "Confirmar senha",
      confirmation_required:
        "Acesse o link enviado por e-mail para confirmar sua conta.",
      recovery_email_sent:
        "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação em instantes.",
      sign_in_failed: "Não foi possível entrar.",
      sign_in_google_workspace: "Entrar com Google Workspace",
      signup: {
        create_account: "Criar conta",
        create_first_user:
          "Crie a primeira conta de usuário para concluir a configuração.",
        creating: "Criando...",
        initial_user_created: "Usuário inicial criado com sucesso",
      },
      welcome_title: "Bem-vindo ao CRM Pro",
    },
    common: {
      account_manager: "Responsável",
      activity: "Atividade",
      added: "adicionado",
      details: "Detalhes",
      last_activity_with_date: "última atividade %{date}",
      load_more: "Carregar mais",
      misc: "Outros",
      past: "Anteriores",
      read_more: "Ler mais",
      retry: "Tentar novamente",
      show_less: "Mostrar menos",
      copied: "Copiado!",
      copy: "Copiar",
      loading: "Carregando...",
      me: "Eu",
      task_count: "%{smart_count} tarefa |||| %{smart_count} tarefas",
    },
    changelog: {
      title: "Novidades",
    },
    activity: {
      added_company: "%{name} adicionou a empresa",
      you_added_company: "Você adicionou a empresa",
      added_contact: "%{name} adicionou o contato",
      you_added_contact: "Você adicionou o contato",
      added_note: "%{name} adicionou uma nota sobre",
      you_added_note: "Você adicionou uma nota sobre",
      added_note_about_deal: "%{name} adicionou uma nota sobre a negociação",
      you_added_note_about_deal: "Você adicionou uma nota sobre a negociação",
      added_deal: "%{name} adicionou a negociação",
      you_added_deal: "Você adicionou a negociação",
      at_company: "em",
      to: "para",
      load_more: "Carregar mais atividades",
    },
    dashboard: {
      deals_chart: "Receita prevista das negociações",
      deals_pipeline: "Funil de vendas",
      latest_activity: "Atividades recentes",
      latest_activity_error: "Erro ao carregar atividades recentes",
      latest_notes: "Minhas notas recentes",
      latest_notes_added_ago: "adicionada %{timeAgo}",
      stepper: {
        install: "Configurar CRM Pro",
        progress: "%{step}/3 concluído",
        whats_next: "Próximo passo",
      },
      upcoming_tasks: "Próximas tarefas",
    },
    data_import: {
      button: "Importar CSV",
      complete:
        "Importação concluída. %{importCount} registros importados, com %{errorCount} erros",
      csv_file: "Arquivo CSV",
      error:
        "Não foi possível importar o arquivo. Verifique se ele é um CSV válido.",
      progress:
        "%{importCount} de %{rowCount} registros importados, com %{errorCount} erros.",
      remaining_time: "Tempo restante estimado:",
      resource: "Tipo de dado",
      running: "A importação está em andamento. Não feche esta aba.",
      sample_download: "Baixar modelo CSV",
      sample_hint: "Use este arquivo CSV como modelo",
      start: "Iniciar importação",
      stop: "Parar importação",
      title: "Importar dados",
    },
    header: {
      import_data: "Importar JSON",
    },
    image_editor: {
      change: "Alterar",
      drop_hint: "Solte um arquivo aqui ou clique para selecioná-lo.",
      editable_content: "Conteúdo editável",
      title: "Enviar e redimensionar imagem",
      update_image: "Atualizar imagem",
    },
    import: {
      action: {
        download_error_report: "Baixar relatório de erros",
        import: "Importar",
        import_another: "Importar outro arquivo",
      },
      error: {
        unable: "Não foi possível importar este arquivo.",
      },
      idle: {
        description_1:
          "Você pode importar usuários, empresas, contatos, notas, negociações e tarefas.",
        description_2:
          "Os dados devem estar em um arquivo JSON seguindo o modelo abaixo:",
      },
      status: {
        all_success: "Todos os registros foram importados com sucesso.",
        complete: "Importação concluída.",
        failed: "Falhou",
        imported: "Importado",
        in_progress:
          "Importação em andamento. Não saia desta página.",
        some_failed: "Alguns registros não foram importados.",
        table_caption: "Status da importação",
      },
      title: "Importar JSON",
    },
    settings: {
      about: "Sobre",
      companies: {
        sectors: "Setores",
      },
      dark_mode_logo: "Logo no modo escuro",
      deals: {
        categories: "Categorias",
        currency: "Moeda",
        pipeline_help:
          "Selecione quais etapas devem ser consideradas no funil de vendas.",
        pipeline_statuses: "Etapas do funil",
        stages: "Etapas",
      },
      light_mode_logo: "Logo no modo claro",
      notes: {
        statuses: "Status",
      },
      reset_defaults: "Restaurar padrões",
      save_error: "Não foi possível salvar a configuração",
      saved: "Configuração salva com sucesso",
      saving: "Salvando...",
      tasks: {
        types: "Tipos",
      },
      preferences: "Preferências",
      title: "Configurações",
      app_title: "Nome do aplicativo",
      sections: {
        branding: "Identidade visual",
      },
      validation: {
        duplicate: "%{display_name} duplicado: %{items}",
        in_use:
          "Não é possível remover %{display_name} que ainda está em uso nas negociações: %{items}",
        validating: "Validando…",
        entities: {
          categories: "categorias",
          stages: "etapas",
        },
      },
    },
    theme: {
      dark: "Escuro",
      label: "Tema",
      light: "Claro",
      system: "Sistema",
    },
    language: "Idioma",
    navigation: {
      label: "Navegação do CRM",
    },
    profile: {
      add_secondary_email: "Adicionar e-mail",
      email_taken: "%{email} já está sendo usado por outro usuário",
      no_secondary_emails: "Nenhum",
      secondary_email_invalid: "%{email} não é um endereço de e-mail válido",
      secondary_email_is_primary: "%{email} já é seu e-mail principal",
      secondary_email_taken: "%{email} já está sendo usado por outro usuário",
      too_many_secondary_emails:
        "Você não pode adicionar mais de 10 e-mails secundários",
      secondary_emails_help:
        "Outros endereços usados para enviar e-mails. Deixe um campo vazio para removê-lo.",
      inbound: {
        description:
          "Você pode encaminhar e-mails para o endereço de entrada do servidor, por exemplo adicionando-o no campo %{field}. O CRM Pro processará a mensagem e adicionará uma nota ao contato correspondente.",
        title: "E-mail de entrada",
      },
      mcp: {
        title: "Servidor MCP",
        description:
          "Use esta URL para conectar um assistente de IA aos dados do CRM por meio do Model Context Protocol (MCP).",
      },
      password: {
        change: "Alterar senha",
      },
      password_reset_sent:
        "Um e-mail para redefinição de senha foi enviado",
      record_not_found: "Registro não encontrado",
      title: "Perfil",
      updated: "Seu perfil foi atualizado",
      update_error: "Ocorreu um erro. Tente novamente",
    },
    validation: {
      invalid_url: "Informe uma URL válida",
      invalid_linkedin_url: "A URL deve ser do linkedin.com",
    },
  },
} satisfies CrmMessages;
