import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./test/e2e",

  // Timeout pour chaque test
  timeout: 30000,

  // Configuration globale
  use: {
    // URL de base de votre application
    baseURL: "http://localhost:3000",

    // Prendre des screenshots en cas d'échec
    screenshot: "only-on-failure",

    // Enregistrer des vidéos en cas d'échec
    video: "retain-on-failure",

    // Tracer les actions en cas d'échec
    trace: "on-first-retry",
  },

  // Démarrer le serveur de dev avant les tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  // Configuration des navigateurs
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  // Reporter (rapport des tests)
  reporter: [["html"], ["list"]],
});
