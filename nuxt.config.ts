// https://nuxt.com/docs/api/configuration/nuxt-config
import piniaPersistedstate from "pinia-plugin-persistedstate";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  experimental: {
    oxcParser: false
  },
  devtools: { enabled: true },
  css: [
    "./app/assets/css/layouts/navigation.css",
    "./app/assets/css/layouts/button_auth.css",
  ],
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@vite-pwa/nuxt",
    "@nuxt/image",
    "@nuxt/test-utils/module",
  ],
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
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Munchly",
      short_name: "Munchly",
      description: "Application Munchly - commandes de plats en ligne",
      lang: "fr",
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#ff6b6b",
      icons: [
        {
          src: "/images/logo/munchly-logo.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/images/logo/munchly-logo.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      navigateFallback: "/index.html",
    },
  },
  image: {
    provider: "vercel",
    quality: 80,
    format: ["webp"],
    screens: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    },
  },
});
