import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useDataProvider, useLogin, useNotify, useTranslate } from "ra-core";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { CrmDataProvider } from "../providers/types";
import { useConfigurationContext } from "../root/ConfigurationContext";
import type { SignUpData } from "../types";
import { Notification } from "@/components/admin/notification";
import { ConfirmationRequired } from "./ConfirmationRequired";

export const SignupPage = () => {
  const dataProvider = useDataProvider<CrmDataProvider>();
  const { darkModeLogo: logo, title } = useConfigurationContext();
  const navigate = useNavigate();
  const translate = useTranslate();
  const login = useLogin();
  const notify = useNotify();

  const { isPending: isSignUpPending, mutate } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (data: SignUpData) => dataProvider.signUp(data),
    onSuccess: (data) => {
      login({
        email: data.email,
        password: data.password,
        redirectTo: "/contacts",
      })
        .then(() => {
          notify("Conta criada com sucesso.", { type: "success" });
        })
        .catch((err) => {
          if (err.code === "email_not_confirmed") {
            navigate(ConfirmationRequired.path);
          } else {
            notify("Não foi possível entrar na conta.", { type: "error" });
            navigate("/login");
          }
        });
    },
    onError: (error) => {
      notify(error.message, { type: "error" });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignUpData>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<SignUpData> = async (data) => {
    mutate(data);
  };

  return (
    <div className="h-screen p-8">
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt={title}
          width={24}
          className="filter brightness-0 dark:invert"
        />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="h-full">
        <div className="max-w-sm mx-auto h-full flex flex-col justify-center gap-4">
          <h1 className="text-2xl font-bold mb-4">Crie sua conta no CRM Pro</h1>
          <p className="text-base mb-4">
            Cadastre sua empresa e crie o primeiro usuário administrador.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="organization_name">Nome da empresa</Label>
              <Input
                {...register("organization_name", { required: true })}
                id="organization_name"
                type="text"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="first_name">
                {translate("crm.auth.first_name", { _: "Nome" })}
              </Label>
              <Input
                {...register("first_name", { required: true })}
                id="first_name"
                type="text"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="last_name">
                {translate("crm.auth.last_name", { _: "Sobrenome" })}
              </Label>
              <Input
                {...register("last_name", { required: true })}
                id="last_name"
                type="text"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">{translate("ra.auth.email")}</Label>
              <Input
                {...register("email", { required: true })}
                id="email"
                type="email"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">{translate("ra.auth.password")}</Label>
              <Input
                {...register("password", { required: true, minLength: 8 })}
                id="password"
                type="password"
                minLength={8}
                required
              />
            </div>
            <div className="flex flex-col gap-4 justify-between items-center mt-8">
              <Button
                type="submit"
                disabled={!isValid || isSignUpPending}
                className="w-full"
              >
                {isSignUpPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Criando...
                  </>
                ) : (
                  "Criar conta"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Já tenho uma conta
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Notification />
    </div>
  );
};

SignupPage.path = "/sign-up";
