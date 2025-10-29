<!-- Page de connexion du site -->
<script setup lang="ts">
useHead({
  title: "Connexion - Munchly",
  meta: [
    {
      name: "description",
      content:
        "Connectez-vous à votre compte pour commander vos repas préférés et suivre vos commandes.",
    },
    { name: "robots", content: "noindex, nofollow" },
  ],
});

useSeoMeta({
  title: "Connexion - Munchly",
  ogTitle: "Connexion - Munchly",
  description:
    "Connectez-vous à votre compte pour commander vos repas préférés et suivre vos commandes.",
  ogDescription:
    "Connectez-vous à votre compte pour commander vos repas préférés et suivre vos commandes.",
});

definePageMeta({
  ssr: false,
});

import { onMounted, ref } from "vue";
import { useUserStore } from "~/stores/users/user";
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
        navigateTo("/admin");
        break;
      case "restaurateur":
        navigateTo("/restaurateur");
        break;
      case "user":
        navigateTo("/restaurants");
        break;
      default:
        navigateTo("/");
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
      <h1>Connexion</h1>

      <div class="form-group">
        <div class="input-group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="exemple@mail.com" />
        </div>

        <div class="input-group">
          <label>Mot de passe</label>
          <input v-model="password" type="password" placeholder="••••••••" />
        </div>

        <button @click="handleLogin">Se connecter</button>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>

      <p class="auth-link">
        Pas encore de compte ?
        <NuxtLink to="/register">S'inscrire</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style>
@import "@/assets/css/pages/auth.css";
</style>
