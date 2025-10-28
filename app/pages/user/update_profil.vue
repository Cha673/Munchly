<script setup lang="ts">
definePageMeta({
  layout: "user",
  middleware: ["auth-user"],
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
  <div>
    <h1>Mettre à jour mon profil</h1>

    <div>
      <label>Nom</label>
      <input v-model="name" type="text" />
    </div>

    <div>
      <label>Email</label>
      <input v-model="email" type="email" />
    </div>

    <div>
      <label>Mot de passe</label>
      <input v-model="password" type="password" />
    </div>

    <button @click="updateProfile">Enregistrer</button>

    <p v-if="error" style="color: red">{{ error }}</p>
    <p v-if="success" style="color: green">{{ success }}</p>
  </div>

  <div class="actions-supplementaires">
    <NuxtLink to="/user/commandes" class="btn-historique">
      Voir l'historique de mes commandes
    </NuxtLink>
  </div>
</template>
