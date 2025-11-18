<!-- Page d'inscription du sites -->
<script setup lang="ts">
import { useUserStore } from "~/stores/users/user";
import type { User } from "~/types/utilisateurs/users";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const { $localePath } = useNuxtApp();

useHead({
  title: t("meta.inscription_title"),
  meta: [
    {
      name: "description",
      content: t("meta.inscription_description"),
    },
    { name: "robots", content: "noindex, nofollow" },
  ],
});

useSeoMeta({
  title: t("meta.inscription_title"),
  ogTitle: t("meta.inscription_title"),
  description: t("meta.inscription_description"),
  ogDescription: t("meta.inscription_description"),
});
definePageMeta({
  ssr: false,
  middlewares: "auth",
});

const userStore = useUserStore();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const role = ref("user");
const error = ref("");

const handleRegister = async () => {
  try {
    // Vérifications de base
    if (!name.value || !email.value || !password.value) {
      error.value = "Tous les champs sont obligatoires";
      return;
    }

    // Création du nouvel utilisateur
    const newUser: User = {
      id: Date.now(),
      name: name.value,
      email: email.value,
      password: password.value,
      role: "user",
    };

    userStore.register(newUser);
    error.value = "";

    // Redirection selon le rôle
    switch (role.value) {
      case "user":
        await navigateTo($localePath("/commandes"));
        break;
      default:
        await navigateTo($localePath("/"));
    }
  } catch (err: any) {
    error.value = err.message;
    password.value = "";
    confirmPassword.value = "";
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>{{ t("auth.create_account") }}</h1>

      <div class="form-group">
        <div class="input-group">
          <label>{{ t("auth.nom_label") }}</label>
          <input v-model="name" type="text" placeholder="John Doe" />
        </div>

        <div class="input-group">
          <label>{{ t("auth.email_label") }}</label>
          <input
            v-model="email"
            type="email"
            :placeholder="t('auth.email_placeholder')"
          />
        </div>

        <div class="input-group">
          <label>{{ t("auth.password_label") }}</label>
          <input v-model="password" type="password" placeholder="••••••••" />
        </div>

        <button @click="handleRegister">{{ t("auth.create_account") }}</button>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>

      <p class="auth-link">
        Déjà un compte ?
        <NuxtLink :to="$localePath('/login')">Se connecter</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style>
@import "@/assets/css/pages/auth.css";
</style>
