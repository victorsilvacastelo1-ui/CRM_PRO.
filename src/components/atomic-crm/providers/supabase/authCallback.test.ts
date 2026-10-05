import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";

import type * as AuthCallbackModule from "./authCallback";
let callback: typeof AuthCallbackModule;
const session = { user: { id: "user-a" } };
const setSession = vi.fn();
const exchangeCodeForSession = vi.fn();
const client = {
  auth: { setSession, exchangeCodeForSession },
} as unknown as SupabaseClient;

beforeEach(async () => {
  vi.resetModules();
  vi.resetAllMocks();
  vi.stubGlobal("window", {
    location: { origin: "https://crm.example", hash: "", search: "" },
  });
  callback = await import("./authCallback");
  setSession.mockResolvedValue({ data: { session }, error: null });
  exchangeCodeForSession.mockResolvedValue({ data: { session }, error: null });
});

function link(params: string) {
  window.location.hash = `#/auth-callback?${params}`;
}

describe("email authentication", () => {
  it("uses the existing invitation callback path on the current origin", () => {
    expect(callback.getAuthCallbackUrl()).toBe(
      "https://crm.example/sistema/auth-callback.html",
    );
  });
  it.each(["recovery", "invite"])(
    "validates %s tokens before showing the password form",
    async (type) => {
      link(`access_token=a&refresh_token=b&type=${type}`);
      expect(await callback.completeAuthCallback(client)).toEqual({
        redirectTo: "/set-password",
      });
      expect(setSession).toHaveBeenCalledWith({
        access_token: "a",
        refresh_token: "b",
      });
    },
  );
  it("establishes the session for signup confirmation", async () => {
    link("access_token=a&refresh_token=b&type=signup");
    expect(await callback.completeAuthCallback(client)).toEqual({
      redirectTo: "/",
    });
    expect(setSession).toHaveBeenCalledTimes(1);
  });
  it("exchanges PKCE codes", async () => {
    link("code=one-use-code");
    expect(await callback.completeAuthCallback(client)).toEqual({
      redirectTo: "/set-password",
    });
    expect(exchangeCodeForSession).toHaveBeenCalledWith("one-use-code");
  });
  it("does not exchange the same one-use code twice on a repeated mount", async () => {
    link("code=one-use-code");
    await Promise.all([
      callback.completeAuthCallback(client),
      callback.completeAuthCallback(client),
    ]);
    expect(exchangeCodeForSession).toHaveBeenCalledTimes(1);
  });
  it.each([
    "",
    "access_token=a",
    "access_token=null&refresh_token=null",
    "error=access_denied",
    "error_code=otp_expired",
  ])('rejects incomplete or expired link "%s"', async (params) => {
    link(params);
    expect(await callback.completeAuthCallback(client)).toEqual({
      redirectTo: "/set-password?error=invalid_link",
    });
    expect(setSession).not.toHaveBeenCalled();
  });
  it("rejects invalid server credentials", async () => {
    link("access_token=a&refresh_token=b&type=recovery");
    setSession.mockResolvedValue({
      data: { session: null },
      error: new Error("expired"),
    });
    expect(await callback.completeAuthCallback(client)).toEqual({
      redirectTo: "/set-password?error=invalid_link",
    });
  });
  it("offers recovery after network failure", async () => {
    link("code=a");
    exchangeCodeForSession.mockRejectedValue(new Error("network"));
    expect(await callback.completeAuthCallback(client)).toEqual({
      redirectTo: "/set-password?error=invalid_link",
    });
  });
  it("reads encoded credentials without truncating reserved characters", () => {
    const p = callback.readAuthParams({
      hash: "#access_token=a%2Bb%3Dc&refresh_token=d%26e",
      search: "",
    });
    expect(p.get("access_token")).toBe("a+b=c");
    expect(p.get("refresh_token")).toBe("d&e");
  });
});
