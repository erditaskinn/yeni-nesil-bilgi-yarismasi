import { defineConfig, devices } from "@playwright/test";
const port = process.env.E2E_PORT ?? "3100";
export default defineConfig({
  testDir: "./tests/e2e",
  testIgnore: "**/membership.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    channel: "msedge",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "mobile",
      testIgnore: ["**/edge-cases.spec.ts", "**/membership.spec.ts"],
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
    {
      name: "tablet",
      testIgnore: ["**/edge-cases.spec.ts", "**/membership.spec.ts"],
      use: { ...devices["iPad Mini"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: `node node_modules/serve/build/main.js out --listen tcp://127.0.0.1:${port} --no-clipboard`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: { NO_UPDATE_CHECK: "1" },
  },
});
