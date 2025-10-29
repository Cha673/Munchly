<!-- Page d'ajout d'un nouveau restaurateur
  Formulaire permettant à l'administrateur d'ajouter un nouveau compte restaurateur
 -->
<script setup lang="ts">
import { useUserStore } from "~/stores/users/user";
import { ref } from "vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth-admin"],
});
useHead({
  title: "Ajouter un restaurateur - Administration Munchly",
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    {
      name: "description",
      content:
        "Créez un nouveau compte restaurateur et configurez ses accès à la plateforme Munchly.",
    },
  ],
});

useSeoMeta({
  title: "Ajouter un restaurateur - Administration Munchly",
  ogTitle: "Ajouter un restaurateur - Administration Munchly",
  description:
    "Créez un nouveau compte restaurateur et configurez ses accès à la plateforme Munchly.",
  ogDescription:
    "Créez un nouveau compte restaurateur et configurez ses accès à la plateforme Munchly.",
  ogImage: "/images/add-restaurateur.jpg",
  twitterCard: "summary_large_image",
});

const userStore = useUserStore();
const router = useRouter();

const newUser = ref({
  name: "",
  email: "",
  password: "",
});

const handleAddRestaurateur = async () => {
  try {
    userStore.addRestaurateur({
      ...newUser.value,
      role: "restaurateur",
    });
    await navigateTo("/admin");
  } catch (error: any) {
    alert(error.message);
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>Ajouter un Restaurateur</h1>

      <div class="form-group">
        <div class="input-group">
          <label for="name">Nom</label>
          <input
            id="name"
            v-model="newUser.name"
            type="text"
            placeholder="Nom du restaurateur"
            required
          />
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="newUser.email"
            type="email"
            placeholder="Email du restaurateur"
            required
          />
        </div>

        <div class="input-group">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="newUser.password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" @click.prevent="handleAddRestaurateur">
          Ajouter le restaurateur
        </button>
      </div>

      <p class="auth-link">
        <NuxtLink to="/admin">Retour au dashboard</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style>
@import "@/assets/css/pages/auth.css";
</style>
