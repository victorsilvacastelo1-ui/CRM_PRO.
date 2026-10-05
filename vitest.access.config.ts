import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/components/atomic-crm/providers/supabase/auth*.test.ts"],
  },
});
