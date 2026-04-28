<!-- Page de connexion du site -->
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "~/stores/users/user";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const { $localePath } = useNuxtApp();

useHead({
  title: t("auth.login_title"),
  meta: [
    {
      name: "description",
      content: t("auth.login_description"),
    },
    { name: "robots", content: "noindex, nofollow" },
  ],
});

useSeoMeta({
  title: t("auth.login_title"),
  ogTitle: t("auth.login_title"),
  description: t("auth.login_description"),
  ogDescription: t("auth.login_description"),
});

definePageMeta({
  ssr: false,
});

const userStore = useUserStore();

// Vérifier si l'utilisateur est connecté au chargement de la page
onMounted(() => {
  if (userStore.isUserAuthenticated) {
    console.log("Utilisateur connecté, déconnexion...");
    userStore.logout();
    error.value = "Vous avez été déconnecté";
  }
});

const email = ref("");
const password = ref("");
const error = ref("");

const handleLogin = () => {
  try {
    // Réinitialiser l'erreur
    error.value = "";

    // Tentative de connexion
    const user = userStore.login({
      email: email.value,
      password: password.value,
    });

    // Rediriger selon le rôle
    switch (user.role) {
      case "admin":
        navigateTo($localePath("/admin"));
        break;
      case "restaurateur":
        navigateTo($localePath("/restaurateur"));
        break;
      case "user":
        navigateTo($localePath("/restaurants"));
        break;
      default:
        navigateTo($localePath("/"));
    }
  } catch (err: any) {
    error.value = err.message;
    password.value = "";
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>{{ t("login") }}</h1>

      <div class="form-group">
        <div class="input-group">
          <label>{{ t("auth.email_label") }}</label>
          <input v-model="email" type="email" placeholder="example@email.com" />
        </div>

        <div class="input-group">
          <label>{{ t("auth.password_label") }}</label>
          <input v-model="password" type="password" placeholder="••••••••" />
        </div>

        <button @click="handleLogin">{{ t("login") }}</button>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>

      <p class="auth-link">
        {{ t("auth.no_account") }}
        <NuxtLink :to="$localePath('/register')">{{
          t("auth.register_link")
        }}</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style>
@import "@/assets/css/pages/auth.css";
</style>
