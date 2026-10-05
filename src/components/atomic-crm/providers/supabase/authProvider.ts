import type { AuthProvider } from "ra-core";
import {
  type ResetPasswordParams,
  supabaseAuthProvider,
} from "ra-supabase-core";

import { canAccess } from "../commons/canAccess";
import { getSupabaseClient } from "./supabase";
import { completeAuthCallback, getAuthCallbackUrl } from "./authCallback";

const getBaseAuthProvider = () =>
  supabaseAuthProvider(getSupabaseClient(), {
    redirectTo: getAuthCallbackUrl(),
    getIdentity: async () => {
      const sale = await getSale();

      if (sale == null) {
        throw new Error();
      }

      return {
        id: sale.id,
        fullName: `${sale.first_name} ${sale.last_name}`,
        avatar: sale.avatar?.src,
      };
    },
  });

// Only initialization is cached. Roles and disabled status are read from the
// server so an old browser profile cannot grant access to another session.
const IS_INITIALIZED_CACHE_KEY = "RaStore.auth.is_initialized";
const CURRENT_SALE_CACHE_KEY = "RaStore.auth.current_sale";

function getLocalStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export async function getIsInitialized() {
  const storage = getLocalStorage();
  const cachedValue = storage?.getItem(IS_INITIALIZED_CACHE_KEY);
  if (cachedValue != null) {
    return cachedValue === "true";
  }

  const { data } = await getSupabaseClient()
    .from("init_state")
    .select("is_initialized");
  const isInitialized = data?.at(0)?.is_initialized > 0;

  if (isInitialized) {
    storage?.setItem(IS_INITIALIZED_CACHE_KEY, "true");
  }

  return isInitialized;
}

const getSale = async () => {
  const { data: dataSession, error: errorSession } =
    await getSupabaseClient().auth.getSession();

  // Shouldn't happen after login but just in case
  if (dataSession?.session?.user == null || errorSession) {
    return undefined;
  }

  const { data: dataSale, error: errorSale } = await getSupabaseClient()
    .from("sales")
    .select(
      "id, organization_id, first_name, last_name, avatar, administrator, disabled",
    )
    .match({ user_id: dataSession?.session?.user.id })
    .single();

  // Shouldn't happen either as all users are sales but just in case
  if (dataSale == null || errorSale) {
    return undefined;
  }

  return dataSale;
};

function clearCache() {
  const storage = getLocalStorage();
  storage?.removeItem(IS_INITIALIZED_CACHE_KEY);
  storage?.removeItem(CURRENT_SALE_CACHE_KEY);
  storage?.removeItem("REACT_QUERY_OFFLINE_CACHE");
}

export const getAuthProvider = (): AuthProvider => {
  const baseAuthProvider = getBaseAuthProvider();
  return {
    ...baseAuthProvider,
    handleCallback: () => completeAuthCallback(getSupabaseClient()),
    resetPassword: (params: ResetPasswordParams) =>
      baseAuthProvider.resetPassword({
        ...params,
        email: params.email.trim().toLowerCase(),
        redirectTo: getAuthCallbackUrl(),
      }),
    login: async (params) => {
      clearCache();
      if (params.ssoDomain) {
        const { error } = await getSupabaseClient().auth.signInWithSSO({
          domain: params.ssoDomain,
        });
        if (error) {
          throw error;
        }
        return;
      }
      return baseAuthProvider.login(params);
    },
    logout: async (params) => {
      clearCache();
      return baseAuthProvider.logout(params);
    },
    checkAuth: async (params) => {
      // Password recovery and public sign-up routes must remain accessible.
      if (
        window.location.pathname === "/set-password" ||
        window.location.hash.includes("#/set-password") ||
        window.location.pathname === "/forgot-password" ||
        window.location.hash.includes("#/forgot-password") ||
        window.location.pathname === "/sign-up" ||
        window.location.hash.includes("#/sign-up")
      ) {
        return;
      }

      await baseAuthProvider.checkAuth(params);

      // A valid auth session is not enough in the SaaS model: the user must
      // also belong to an organization and have a CRM profile.
      const sale = await getSale();
      if (sale == null || sale.organization_id == null || sale.disabled) {
        await getSupabaseClient().auth.signOut();
        clearCache();
        throw {
          redirectTo: "/login",
          message: "Conta sem acesso a uma organização ativa.",
        };
      }
    },
    canAccess: async (params) => {
      const sale = await getSale();
      if (sale == null || sale.organization_id == null || sale.disabled) {
        return false;
      }

      const role = sale.administrator ? "admin" : "user";
      return canAccess(role, params);
    },
    getAuthorizationDetails(authorizationId: string) {
      return getSupabaseClient().auth.oauth.getAuthorizationDetails(
        authorizationId,
      );
    },
    approveAuthorization(authorizationId: string) {
      return getSupabaseClient().auth.oauth.approveAuthorization(
        authorizationId,
      );
    },
    denyAuthorization(authorizationId: string) {
      return getSupabaseClient().auth.oauth.denyAuthorization(authorizationId);
    },
  };
};
