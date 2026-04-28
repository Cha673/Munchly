<!-- Page modification du profil par l'utilisateur; 
 Fonctionnalités: 
 - Modification des informations personnelles (nom, email, mot de passe) -->

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "~/stores/users/user";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const { $localePath } = useNuxtApp();

definePageMeta({
  layout: "user",
  middleware: ["auth-user"],
});

useHead({
  title: t("meta.page_update_profile"),
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    {
      name: "description",
      content: t("meta.page_update_profile_description"),
    },
  ],
});

useSeoMeta({
  title: t("meta.page_update_profile"),
  ogTitle: t("meta.page_update_profile"),
  description: t("meta.page_update_profile_description"),
  ogDescription: t("meta.page_update_profile_description"),
  ogImage: "/images/munchly-logo.jpg",
  twitterCard: "summary_large_image",
});

const userStore = useUserStore();

const name = ref(userStore.currentUser?.name || "");
const email = ref(userStore.currentUser?.email || "");
const password = ref(userStore.currentUser?.password || "");
const error = ref("");
const success = ref("");

// Mettre à jour le profil
const updateProfile = () => {
  if (!name.value || !email.value) {
    error.value = "Le nom et l'email sont obligatoires";
    return;
  }

  try {
    userStore.updateProfile({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    success.value = "Profil mis à jour avec succès";
    error.value = "";
  } catch (err: any) {
    error.value = err.message || "Erreur lors de la mise à jour";
    success.value = "";
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>{{ t("users.update_profil") }}</h1>

      <div class="form-group">
        <div class="input-group">
          <label>{{ t("auth.nom_label") }}</label>
          <input
            v-model="name"
            type="text"
            placeholder="
            t('auth.nom_label')
          "
          />
        </div>

        <div class="input-group">
          <label>{{ t("auth.email_label") }}</label>
          <input
            v-model="email"
            type="email"
            placeholder="
            t('auth.email')
          "
          />
        </div>

        <div class="input-group">
          <label>{{ t("auth.password_label") }}</label>
          <input v-model="password" type="password" placeholder="••••••••" />
        </div>

        <button @click="updateProfile">{{ t("common.save") }}</button>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>

      <p class="auth-link">
        <NuxtLink :to="$localePath('/user/commandes')">
          {{ t("users.historique_commandes") }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<style>
@import "@/assets/css/pages/auth.css";
</style>
