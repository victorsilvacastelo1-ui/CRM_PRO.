import type { SupabaseClient } from "@supabase/supabase-js";

export const getAuthCallbackUrl = () =>
  new URL("/sistema/auth-callback.html", window.location.origin).href;

export function readAuthParams(location: Pick<Location, "hash" | "search">) {
  const hash = location.hash.replace(/^#/, "");
  const query = hash.startsWith("/") ? (hash.split("?")[1] ?? "") : hash;
  const params = new URLSearchParams(location.search);
  new URLSearchParams(query).forEach((value, key) => params.set(key, value));
  return params;
}

// React may mount the callback twice. A code/refresh token must be used once.
let pending: Promise<{ redirectTo: string }> | undefined;
let pendingKey: string | undefined;
export function completeAuthCallback(client: SupabaseClient) {
  const params = readAuthParams(window.location);
  const key = params.toString();
  if (pending && pendingKey === key) return pending;
  pendingKey = key;
  pending = (async () => {
    const invalid = { redirectTo: "/set-password?error=invalid_link" };
    if (params.has("error") || params.has("error_code")) return invalid;
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const code = params.get("code");
    const type = params.get("type");
    try {
      const result = code
        ? await client.auth.exchangeCodeForSession(code)
        : access_token &&
            refresh_token &&
            access_token !== "null" &&
            refresh_token !== "null"
          ? await client.auth.setSession({ access_token, refresh_token })
          : null;
      if (!result || result.error || !result.data.session) return invalid;
      return {
        redirectTo:
          type === "recovery" || type === "invite" || code
            ? "/set-password"
            : "/",
      };
    } catch {
      return invalid;
    }
  })();
  return pending;
}
