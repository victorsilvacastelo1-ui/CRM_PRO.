import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { corsHeaders, OptionsMiddleware } from "../_shared/cors.ts";
import { createErrorResponse } from "../_shared/utils.ts";
import { AuthMiddleware, UserMiddleware } from "../_shared/authentication.ts";
import { getUserSale } from "../_shared/getUserSale.ts";
import {
  findInvalidEmail,
  MAX_SECONDARY_EMAILS,
  normalizeSecondaryEmails,
} from "./secondaryEmails.ts";

async function updateSaleDisabled(
  user_id: string,
  disabled: boolean,
  organization_id: number,
) {
  return await supabaseAdmin
    .from("sales")
    .update({ disabled: disabled ?? false })
    .eq("user_id", user_id)
    .eq("organization_id", organization_id);
}

async function updateSaleAdministrator(
  user_id: string,
  administrator: boolean,
  organization_id: number,
) {
  const { data: sales, error: salesError } = await supabaseAdmin
    .from("sales")
    .update({ administrator })
    .eq("user_id", user_id)
    .eq("organization_id", organization_id)
    .select("*");

  if (!sales?.length || salesError) {
    console.error("Error updating user:", salesError);
    throw salesError ?? new Error("Failed to update sale");
  }

  const { error: membershipError } = await supabaseAdmin
    .from("organization_members")
    .update({ role: administrator ? "admin" : "member" })
    .eq("user_id", user_id)
    .eq("organization_id", organization_id);

  if (membershipError) {
    console.error("Error updating organization membership:", membershipError);
    throw membershipError;
  }

  return sales.at(0);
}

async function createSale(
  user_id: string,
  data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    disabled: boolean;
    administrator: boolean;
    organization_id: number;
  },
) {
  const { error: membershipError } = await supabaseAdmin
    .from("organization_members")
    .upsert(
      {
        organization_id: data.organization_id,
        user_id,
        role: data.administrator ? "admin" : "member",
      },
      { onConflict: "user_id" },
    );

  if (membershipError) {
    console.error("Error creating organization membership:", membershipError);
    throw membershipError;
  }

  const { password: _password, ...saleData } = data;
  const { data: sales, error: salesError } = await supabaseAdmin
    .from("sales")
    .insert({ ...saleData, user_id })
    .select("*");

  if (!sales?.length || salesError) {
    console.error("Error creating user:", salesError);
    throw salesError ?? new Error("Failed to create sale");
  }
  return sales.at(0);
}

async function findEmailUsedByAnotherSale(
  emails: string[],
  excludeSalesId?: number,
) {
  const isTakenBy = async (
    column: "email" | "secondary_emails",
    email: string,
  ) => {
    const selected = supabaseAdmin.from("sales").select("id");
    let query =
      column === "email"
        ? selected.eq("email", email)
        : selected.contains("secondary_emails", JSON.stringify([email]));

    if (excludeSalesId !== undefined) {
      query = query.neq("id", excludeSalesId);
    }

    const { data: matches, error: salesError } = await query.limit(1);

    if (salesError) {
      console.error("Error fetching sales:", salesError);
      throw salesError;
    }

    return Boolean(matches?.length);
  };

  for (const email of emails) {
    if (
      (await isTakenBy("email", email)) ||
      (await isTakenBy("secondary_emails", email))
    ) {
      return email;
    }
  }

  return undefined;
}

async function updateSaleSecondaryEmails(
  user_id: string,
  secondary_emails: string[],
  organization_id: number,
) {
  const { error: salesError } = await supabaseAdmin
    .from("sales")
    .update({ secondary_emails })
    .eq("user_id", user_id)
    .eq("organization_id", organization_id);

  if (salesError) {
    console.error("Error updating user:", salesError);
    throw salesError;
  }
}

async function updateSaleAvatar(
  user_id: string,
  avatar: string,
  organization_id: number,
) {
  const { data: sales, error: salesError } = await supabaseAdmin
    .from("sales")
    .update({ avatar })
    .eq("user_id", user_id)
    .eq("organization_id", organization_id)
    .select("*");

  if (!sales?.length || salesError) {
    console.error("Error updating user:", salesError);
    throw salesError ?? new Error("Failed to update sale");
  }
  return sales.at(0);
}

async function inviteUser(req: Request, currentUserSale: any) {
  const { email, first_name, last_name, disabled, administrator } =
    await req.json();

  if (!currentUserSale.administrator) {
    return createErrorResponse(401, "Not Authorized");
  }

  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!normalizedEmail) {
    return createErrorResponse(400, "E-mail é obrigatório", {
      code: "email_required",
    });
  }

  const takenEmail = await findEmailUsedByAnotherSale([normalizedEmail]);
  if (takenEmail) {
    return createErrorResponse(
      409,
      "E-mail já está vinculado a outro usuário: " + takenEmail,
      { code: "email_taken", email: takenEmail },
    );
  }

  const redirectTo =
    Deno.env.get("CRM_INVITE_REDIRECT_URL") ??
    "https://crm-pro-n8jh.netlify.app/sistema/auth-callback.html";

  const { data: inviteData, error: inviteError } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(normalizedEmail, {
      data: { first_name, last_name },
      redirectTo,
    });

  if (inviteError) {
    console.error("Error inviting user:", inviteError);

    const isRateLimit =
      inviteError.status === 429 ||
      /rate limit/i.test(inviteError.message ?? "");

    return createErrorResponse(
      isRateLimit ? 429 : (inviteError.status ?? 500),
      isRateLimit
        ? "Limite de envio de e-mails do Supabase atingido. Configure um SMTP próprio para enviar novos convites."
        : "Não foi possível enviar o convite por e-mail.",
      {
        code: isRateLimit ? "email_rate_limit" : (inviteError.code ?? "invite_failed"),
      },
    );
  }

  const user = inviteData?.user;
  if (!user) {
    console.error("Error inviting user: undefined invited user");
    return createErrorResponse(500, "Não foi possível criar o usuário", {
      code: "invite_user_missing",
    });
  }

  const { error: metadataError } =
    await supabaseAdmin.auth.admin.updateUserById(user.id, {
      app_metadata: {
        organization_id: currentUserSale.organization_id,
        organization_role: administrator ? "admin" : "member",
      },
      user_metadata: { first_name, last_name },
    });

  if (metadataError) {
    console.error("Error updating invited user metadata:", metadataError);
    await supabaseAdmin.auth.admin.deleteUser(user.id).catch(() => undefined);
    return createErrorResponse(500, "Não foi possível concluir o convite", {
      code: "invite_metadata_failed",
    });
  }

  try {
    const sale = await createSale(user.id, {
      email: normalizedEmail,
      password: "",
      first_name,
      last_name,
      disabled: disabled ?? false,
      administrator: administrator ?? false,
      organization_id: currentUserSale.organization_id,
    });

    return new Response(
      JSON.stringify({
        data: sale,
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error) {
    console.error("Error creating invited CRM user:", error);

    // Avoid leaving an orphan auth account if the CRM profile cannot be created.
    await supabaseAdmin.auth.admin.deleteUser(user.id).catch(() => undefined);

    return createErrorResponse(
      (error as any).status ?? 500,
      (error as Error).message || "Não foi possível concluir o convite",
      {
        code: (error as any).code ?? "invite_profile_failed",
      },
    );
  }
}


async function deleteUsers(req: Request, currentUserSale: any) {
  if (!currentUserSale.administrator) {
    return createErrorResponse(401, "Not Authorized");
  }

  const body = await req.json();
  const requestedIds = Array.isArray(body?.sales_ids)
    ? body.sales_ids
    : body?.sales_id != null
      ? [body.sales_id]
      : [];

  const salesIds = [
    ...new Set(
      requestedIds
        .map((id: unknown) => Number(id))
        .filter((id: number) => Number.isInteger(id) && id > 0),
    ),
  ];

  if (!salesIds.length) {
    return createErrorResponse(400, "Selecione pelo menos um usuário", {
      code: "missing_sales_ids",
    });
  }

  if (salesIds.includes(Number(currentUserSale.id))) {
    return createErrorResponse(
      400,
      "Você não pode excluir o usuário que está conectado no momento.",
      { code: "cannot_delete_current_user" },
    );
  }

  const { data: userIds, error: deleteError } = await supabaseAdmin.rpc(
    "delete_organization_sales_users",
    {
      p_target_sales_ids: salesIds,
      p_replacement_sales_id: currentUserSale.id,
      p_organization_id: currentUserSale.organization_id,
    },
  );

  if (deleteError) {
    console.error("Error deleting CRM users:", deleteError);
    return createErrorResponse(
      400,
      deleteError.message || "Não foi possível excluir o usuário.",
      { code: deleteError.code ?? "delete_user_failed" },
    );
  }

  const authCleanupWarnings: string[] = [];
  for (const userId of (userIds ?? []) as string[]) {
    const { error: authDeleteError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authDeleteError) {
      console.error("Error deleting auth user:", authDeleteError);
      authCleanupWarnings.push(userId);
    }
  }

  return new Response(
    JSON.stringify({
      data: salesIds,
      auth_cleanup_warnings: authCleanupWarnings,
    }),
    {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    },
  );
}

async function patchUser(req: Request, currentUserSale: any) {
  const {
    sales_id,
    email,
    secondary_emails,
    first_name,
    last_name,
    avatar,
    administrator,
    disabled,
  } = await req.json();
  const { data: sale } = await supabaseAdmin
    .from("sales")
    .select("*")
    .eq("id", sales_id)
    .eq("organization_id", currentUserSale.organization_id)
    .single();

  if (!sale) {
    return createErrorResponse(404, "Not Found");
  }

  // Users can only update their own profile unless they are an administrator
  if (!currentUserSale.administrator && currentUserSale.id !== sale.id) {
    return createErrorResponse(401, "Not Authorized");
  }

  if (email && email.trim().toLowerCase() !== sale.email.toLowerCase()) {
    const takenEmail = await findEmailUsedByAnotherSale(
      [email.trim().toLowerCase()],
      sales_id,
    );
    if (takenEmail) {
      return createErrorResponse(
        409,
        `Email already used by another user: ${takenEmail}`,
        { code: "email_taken", email: takenEmail },
      );
    }
  }

  let normalizedSecondaryEmails: string[] | undefined;
  if (secondary_emails !== undefined) {
    normalizedSecondaryEmails = normalizeSecondaryEmails(secondary_emails);
    if (!normalizedSecondaryEmails) {
      return createErrorResponse(400, "secondary_emails must be an array", {
        code: "invalid_secondary_emails_payload",
      });
    }

    if (normalizedSecondaryEmails.length > MAX_SECONDARY_EMAILS) {
      return createErrorResponse(
        400,
        `No more than ${MAX_SECONDARY_EMAILS} secondary emails are allowed`,
        { code: "too_many_secondary_emails" },
      );
    }

    const invalidEmail = findInvalidEmail(normalizedSecondaryEmails);
    if (invalidEmail) {
      return createErrorResponse(
        400,
        `Invalid secondary email: ${invalidEmail}`,
        { code: "invalid_secondary_email", email: invalidEmail },
      );
    }

    const takenEmail = await findEmailUsedByAnotherSale(
      normalizedSecondaryEmails,
      sales_id,
    );
    if (takenEmail) {
      return createErrorResponse(
        409,
        `Secondary email already used by another user: ${takenEmail}`,
        { code: "secondary_email_taken", email: takenEmail },
      );
    }
  }

  const primaryEmail = (email ?? sale.email).trim().toLowerCase();
  const effectiveSecondaryEmails =
    normalizedSecondaryEmails ??
    (Array.isArray(sale.secondary_emails) ? sale.secondary_emails : []);

  if (effectiveSecondaryEmails.includes(primaryEmail)) {
    return createErrorResponse(
      409,
      `Secondary email is already the main address: ${primaryEmail}`,
      { code: "secondary_email_is_primary", email: primaryEmail },
    );
  }

  const { data, error: userError } =
    await supabaseAdmin.auth.admin.updateUserById(sale.user_id, {
      email,
      ban_duration: disabled ? "87600h" : "none",
      user_metadata: { first_name, last_name },
    });

  if (!data?.user || userError) {
    console.error("Error patching user:", userError);
    return createErrorResponse(500, "Internal Server Error");
  }

  try {
    if (avatar) {
      await updateSaleAvatar(
        data.user.id,
        avatar,
        currentUserSale.organization_id,
      );
    }

    if (normalizedSecondaryEmails) {
      await updateSaleSecondaryEmails(
        data.user.id,
        normalizedSecondaryEmails,
        currentUserSale.organization_id,
      );
    }
  } catch (e) {
    console.error("Error patching sale:", e);
    return createErrorResponse(500, "Internal Server Error");
  }

  // Only administrators can update the administrator and disabled status
  if (!currentUserSale.administrator) {
    const { data: new_sale } = await supabaseAdmin
      .from("sales")
      .select("*")
      .eq("id", sales_id)
      .eq("organization_id", currentUserSale.organization_id)
      .single();
    return new Response(
      JSON.stringify({
        data: new_sale,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  }

  try {
    await updateSaleDisabled(
      data.user.id,
      disabled,
      currentUserSale.organization_id,
    );
    const sale = await updateSaleAdministrator(
      data.user.id,
      administrator,
      currentUserSale.organization_id,
    );
    return new Response(
      JSON.stringify({
        data: sale,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (e) {
    console.error("Error patching sale:", e);
    return createErrorResponse(500, "Internal Server Error");
  }
}

Deno.serve(async (req: Request) =>
  OptionsMiddleware(req, async (req) =>
    AuthMiddleware(req, async (req) =>
      UserMiddleware(req, async (req, user) => {
        const currentUserSale = await getUserSale(user);
        if (!currentUserSale) {
          return createErrorResponse(401, "Unauthorized");
        }

        try {
          if (req.method === "POST") {
            return await inviteUser(req, currentUserSale);
          }

          if (req.method === "PATCH") {
            return await patchUser(req, currentUserSale);
          }

          if (req.method === "DELETE") {
            return await deleteUsers(req, currentUserSale);
          }
        } catch (e) {
          console.error("Unhandled error in the users function:", e);
          return createErrorResponse(500, "Internal Server Error");
        }

        return createErrorResponse(405, "Method Not Allowed");
      }),
    ),
  ),
);
