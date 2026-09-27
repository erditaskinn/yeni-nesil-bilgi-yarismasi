import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
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
      testIgnore: "**/edge-cases.spec.ts",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
    {
      name: "tablet",
      testIgnore: "**/edge-cases.spec.ts",
      use: { ...devices["iPad Mini"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: "node node_modules/serve/build/main.js out --listen tcp://127.0.0.1:3100 --no-clipboard",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: { NO_UPDATE_CHECK: "1" },
  },
});
