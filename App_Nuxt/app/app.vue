<script setup>
useHead({
  htmlAttrs: {
    lang: "fr",
  },
  link: [
    { rel: "manifest", href: "/manifest.webmanifest" },
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    { rel: "apple-touch-icon", href: "/icons/icon-192.png" },
  ],
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#f9fafb" },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    { name: "apple-mobile-web-app-title", content: "Munchly" },
  ],
});
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<style>
body {
  margin: 0;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial,
    sans-serif;
}

main {
  margin: 0 auto;
  min-height: calc(100vh - 100px);
}
</style>
