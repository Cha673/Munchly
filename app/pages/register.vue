<script setup lang="ts">
definePageMeta({
  ssr: false,
  middlewares: "auth",
});

import { useUserStore } from "~/stores/users/user";
import type { User } from "~/types/utilisateurs/users";
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

    // if (password.value.length < 6) {
    //   error.value = "Le mot de passe doit contenir au moins 6 caractères";
    //   return;
    // }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email.value)) {
    //   error.value = "Format d'email invalide";
    //   return;
    // }

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
        await navigateTo("/commandes");
        break;
      default:
        await navigateTo("/");
    }
  } catch (err: any) {
    error.value = err.message;
    password.value = "";
    confirmPassword.value = "";
  }
};
</script>

<template>
  <div>
    <h1>Créer un compte</h1>

    <div>
      <label>Nom complet</label>
      <input v-model="name" type="text" placeholder="John Doe" />
    </div>

    <div>
      <label>Email</label>
      <input v-model="email" type="email" placeholder="exemple@mail.com" />
    </div>

    <div>
      <label>Mot de passe</label>
      <input v-model="password" type="password" placeholder="••••••••" />
    </div>

    <button @click="handleRegister">S'inscrire</button>

    <p v-if="error">{{ error }}</p>

    <p>
      Déjà un compte ?
      <NuxtLink to="/">Se connecter</NuxtLink>
    </p>
  </div>
</template>

<!-- <style scoped></style> -->
