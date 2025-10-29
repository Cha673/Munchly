<!-- Page modification du profil par l'utilisateur; 
 Fonctionnalités: 
 - Modification des informations personnelles (nom, email, mot de passe) -->

<script setup lang="ts">
definePageMeta({
  layout: "user",
  middleware: ["auth-user"],
});

useHead({
  title: "Modifier mon profil - Munchly",
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    {
      name: "description",
      content:
        "Mettez à jour vos informations personnelles, modifiez votre email et gérez votre mot de passe en toute sécurité.",
    },
  ],
});

useSeoMeta({
  title: "Modifier mon profil - Munchly",
  ogTitle: "Modifier mon profil - Munchly",
  description:
    "Mettez à jour vos informations personnelles, modifiez votre email et gérez votre mot de passe en toute sécurité.",
  ogDescription:
    "Mettez à jour vos informations personnelles, modifiez votre email et gérez votre mot de passe en toute sécurité.",
  ogImage: "/images/munchly-logo.jpg",
  twitterCard: "summary_large_image",
});

import { ref } from "vue";
import { useUserStore } from "~/stores/users/user";

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
      <h1>Mettre à jour mon profil</h1>

      <div class="form-group">
        <div class="input-group">
          <label>Nom</label>
          <input v-model="name" type="text" placeholder="Votre nom" />
        </div>

        <div class="input-group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="votre@email.com" />
        </div>

        <div class="input-group">
          <label>Mot de passe</label>
          <input v-model="password" type="password" placeholder="••••••••" />
        </div>

        <button @click="updateProfile">Enregistrer</button>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>

      <p class="auth-link">
        <NuxtLink to="/user/commandes">
          Voir l'historique de mes commandes
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<style>
@import "@/assets/css/pages/auth.css";
</style>
