import { defineConfig } from " @playwright/test\;

export default defineConfig({
 testDir: \./apps/web/e2e\,
 fullyParallel: true,
 reporter: \html\,
 use: {
 baseURL: \http://localhost:3000\,
 trace: \on-first-retry\,
 screenshot: \only-on-failure\,
 },
 projects: [
 {
 name: \chromium\,
 use: { browserName: \chromium\ },
 },
 ],
});
