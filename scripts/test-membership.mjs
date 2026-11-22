import { spawnSync } from "node:child_process";
// Build a separate fixture output: fake public values never enter out/mobile-out.
const build = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], { stdio: "inherit", env: { ...process.env, NEXT_PUBLIC_ANDROID_BUILD: "0", MEMBERSHIP_TEST_BUILD: "1", NEXT_PUBLIC_GOOGLE_AUTH_ENABLED: "true", NEXT_PUBLIC_SUPABASE_URL: "https://membership-test.supabase.co", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test_only" } });
if (build.status !== 0) process.exit(build.status ?? 1);
const result = spawnSync(process.execPath, ["node_modules/@playwright/test/cli.js", "test", "--config=playwright.membership.config.ts", ...process.argv.slice(2)], { stdio: "inherit" });
process.exit(result.status ?? 1);
