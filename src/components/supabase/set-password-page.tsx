import { useEffect, useState } from "react";
import {
  Form,
  minLength,
  required,
  useNotify,
  useRedirect,
  useTranslate,
} from "ra-core";
import type { Session } from "@supabase/supabase-js";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/admin/text-input";
import { Layout } from "@/components/supabase/layout";
import { getSupabaseClient } from "@/components/atomic-crm/providers/supabase/supabase";
import { readAuthParams } from "@/components/atomic-crm/providers/supabase/authCallback";

interface SetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export const SetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>();
  const notify = useNotify();
  const translate = useTranslate();
  const redirect = useRedirect();
  const location = useLocation();

  useEffect(() => {
    let active = true;
    const params = readAuthParams(window.location);
    // Older emails may point directly to this page with token parameters.
    // Route them through the same validated callback before showing the form.
    if (params.has("access_token") || params.has("code")) {
      redirect(`/auth-callback?${params.toString()}`);
      return;
    }
    if (new URLSearchParams(location.search).has("error")) {
      setSession(null);
      return;
    }
    getSupabaseClient()
      .auth.getSession()
      .then(({ data, error }) => {
        if (active) setSession(error ? null : data.session);
      })
      .catch(() => {
        if (active) setSession(null);
      });
    return () => {
      active = false;
    };
  }, [location.search, redirect]);

  if (session === undefined) {
    return (
      <Layout>
        <p role="status">Verificando seu link...</p>
      </Layout>
    );
  }
  if (!session) {
    return (
      <Layout>
        <h1 className="text-2xl font-semibold">Link inválido ou expirado</h1>
        <p>
          Solicite um novo link e abra o e-mail mais recente para definir sua
          senha.
        </p>
        <Button asChild>
          <Link to="/forgot-password">Solicitar novo link</Link>
        </Button>
        <Link to="/login" className="text-center underline">
          Voltar para entrar
        </Link>
      </Layout>
    );
  }

  const submit = async (values: SetPasswordFormData) => {
    setLoading(true);
    try {
      const { error } = await getSupabaseClient().auth.updateUser({
        password: values.password,
      });
      if (error) throw error;
      notify("Senha atualizada com sucesso.", { type: "success" });
      // Replace the callback entry, removing tokens from browser history.
      window.history.replaceState(null, "", `${window.location.pathname}#/`);
      redirect("/");
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a senha. Tente novamente.",
        { type: "error" },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-center">Defina sua senha</h1>
      <p>Use pelo menos 8 caracteres.</p>
      <Form
        className="space-y-6"
        onSubmit={submit as SubmitHandler<FieldValues>}
      >
        <TextInput
          label="Nova senha"
          source="password"
          type="password"
          autoComplete="new-password"
          validate={[required(), minLength(8)]}
        />
        <TextInput
          label="Confirmar senha"
          source="confirmPassword"
          type="password"
          autoComplete="new-password"
          validate={[
            required(),
            (value, values) =>
              value === values.password
                ? undefined
                : "As senhas não coincidem.",
          ]}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : translate("ra.action.save")}
        </Button>
      </Form>
    </Layout>
  );
};

SetPasswordPage.path = "set-password";
