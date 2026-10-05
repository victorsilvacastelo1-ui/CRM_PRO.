import { readFileSync } from "node:fs";
import vm from "node:vm";
import { test } from "node:test";
import assert from "node:assert/strict";
const script = readFileSync(
  new URL("../public/auth-redirect.js", import.meta.url),
  "utf8",
);
function redirect(href) {
  let target;
  vm.runInNewContext(script, {
    URL,
    URLSearchParams,
    window: {
      location: {
        href,
        replace: (value) => {
          target = value;
        },
      },
    },
  });
  return target;
}
for (const path of [
  "/",
  "/sistema",
  "/sistema/auth-callback.html",
  "/auth-callback.html",
]) {
  test(`normalizes email tokens from ${path}`, () => {
    const target = redirect(
      `https://crm.example${path}#access_token=a%2Bb&refresh_token=c&type=recovery`,
    );
    assert.equal(
      target,
      "/sistema.html#/auth-callback?access_token=a%2Bb&refresh_token=c&type=recovery",
    );
    assert.equal(new URL(target, "https://crm.example").search, "");
  });
}
test("preserves normal marketing navigation", () =>
  assert.equal(redirect("https://crm.example/#planos"), undefined));
test("preserves internal routes without looping", () =>
  assert.equal(
    redirect("https://crm.example/sistema.html#/auth-callback?code=a"),
    undefined,
  ));
test("drops external redirects and unrelated query parameters", () => {
  assert.equal(
    redirect(
      "https://crm.example/auth-callback.html?code=a&next=https://evil.example",
    ),
    "/sistema.html#/auth-callback?code=a",
  );
});
test("handles expired links without exposing raw error text", () => {
  assert.equal(
    redirect(
      "https://crm.example/auth-callback.html#error=access_denied&error_description=private",
    ),
    "/sistema.html#/auth-callback?error=access_denied",
  );
});
test("handles empty callback", () =>
  assert.equal(
    redirect("https://crm.example/auth-callback.html"),
    "/sistema.html#/auth-callback?error=missing_tokens",
  ));

test("opens legacy hash routes from the landing page in the application", () => {
  assert.equal(
    redirect(
      "https://crm.example/#/auth-callback?access_token=a&refresh_token=b",
    ),
    "/sistema.html#/auth-callback?access_token=a&refresh_token=b",
  );
});
