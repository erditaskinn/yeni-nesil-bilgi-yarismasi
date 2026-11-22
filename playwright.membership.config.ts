import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e", testMatch: "**/membership.spec.ts", outputDir: "artifacts/membership-tests", workers: 1, fullyParallel: false, timeout: 60000, reporter: "list",
  use: { baseURL: "http://127.0.0.1:3121", channel: "msedge", trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
    { name: "tablet", use: { ...devices["iPad Mini"], defaultBrowserType: "chromium" } },
  ],
  webServer: { command: "node node_modules/serve/build/main.js membership-test-out --listen tcp://127.0.0.1:3121 --no-clipboard", url: "http://127.0.0.1:3121", reuseExistingServer: false, env: { NO_UPDATE_CHECK: "1" } },
});
