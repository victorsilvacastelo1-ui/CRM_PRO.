import { beforeEach, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({
  single: vi.fn(),
  getSession: vi.fn(),
  signOut: vi.fn(),
  resetPassword: vi.fn(),
}));
vi.mock("ra-supabase-core", () => ({
  supabaseAuthProvider: () => ({
    checkAuth: vi.fn().mockResolvedValue(undefined),
    login: vi.fn(),
    logout: vi.fn(),
    resetPassword: state.resetPassword,
  }),
}));
vi.mock("./supabase", () => ({
  getSupabaseClient: () => ({
    auth: { getSession: state.getSession, signOut: state.signOut },
    from: () => ({
      select: () => ({ match: () => ({ single: state.single }) }),
    }),
  }),
}));
import { getAuthProvider } from "./authProvider";
let values: Map<string, string>;
beforeEach(() => {
  vi.clearAllMocks();
  values = new Map([
    [
      "RaStore.auth.current_sale",
      '{"administrator":true,"organization_id":1,"id":1}',
    ],
  ]);
  vi.stubGlobal("window", {
    location: {
      origin: "https://crm.example",
      pathname: "/sistema.html",
      hash: "#/contacts",
    },
    localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      removeItem: (key: string) => values.delete(key),
    },
  });
  state.getSession.mockResolvedValue({
    data: { session: { user: { id: "current" } } },
  });
  state.signOut.mockResolvedValue({ error: null });
});
it("ignores an old administrator cached by another account", async () => {
  state.single.mockResolvedValue({
    data: { id: 2, organization_id: 2, administrator: false },
    error: null,
  });
  expect(
    await getAuthProvider().canAccess!({ resource: "sales", action: "list" }),
  ).toBe(false);
});
it("rejects a disabled account even if the cached profile says it is active", async () => {
  state.single.mockResolvedValue({
    data: { id: 2, organization_id: 2, disabled: true },
    error: null,
  });
  await expect(getAuthProvider().checkAuth({})).rejects.toMatchObject({
    redirectTo: "/login",
  });
  expect(state.signOut).toHaveBeenCalledOnce();
});
it("rechecks a role after it has been revoked", async () => {
  state.single
    .mockResolvedValueOnce({
      data: { organization_id: 1, administrator: true },
    })
    .mockResolvedValueOnce({
      data: { organization_id: 1, administrator: false },
    });
  const auth = getAuthProvider();
  expect(await auth.canAccess!({ resource: "sales", action: "list" })).toBe(
    true,
  );
  expect(await auth.canAccess!({ resource: "sales", action: "list" })).toBe(
    false,
  );
});
it("clears legacy offline customer records on logout", async () => {
  values.set("REACT_QUERY_OFFLINE_CACHE", "private-data");
  await getAuthProvider().logout({});
  expect(values.has("REACT_QUERY_OFFLINE_CACHE")).toBe(false);
});
it("sets a valid return URL for password reset", async () => {
  await getAuthProvider().resetPassword({ email: " USER@EXAMPLE.COM " });
  expect(state.resetPassword).toHaveBeenCalledWith({
    email: "user@example.com",
    redirectTo: "https://crm.example/sistema/auth-callback.html",
  });
});
