// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: [
    "./app/assets/css/layouts/navigation.css",
    "./app/assets/css/layouts/button_auth.css",
  ],
  modules: ["@pinia/nuxt", "@nuxtjs/i18n"],
  i18n: {
    locales: [
      {
        code: "fr",
        file: "fr.json",
      },
      {
        code: "en",
        file: "en.json",
      },
    ],
    langDir: "locales",
    defaultLocale: "fr",
    strategy: "prefix_except_default",
    detectBrowserLanguage: false,
  },
});
