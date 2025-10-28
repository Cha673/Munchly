<!-- Page de connexion du site -->
<script setup lang="ts">
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
  <div class="connexion">
    <h1>Connexion</h1>

    <div class="formulaire">
      <div class="item">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="exemple@mail.com" />
      </div>

      <div class="item">
        <label>Mot de passe</label>
        <input v-model="password" type="password" placeholder="••••••••" />
      </div>

      <button @click="handleLogin">Se connecter</button>
    </div>
    <p v-if="error">{{ error }}</p>

    <p>
      Pas encore de compte ?
      <NuxtLink to="/register">S’inscrire</NuxtLink>
    </p>
  </div>
</template>

<style>
.connexion {
  display: flex;
  max-width: 1440px;
  width: 100%;
  padding: 0 2rem;
  flex-direction: column;
}
.formulaire {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}
</style>
