<!-- Page de gestion du restaurant pour le restaurateur -->
<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from "vue";
import { useUserStore } from "~/stores/users/user";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

definePageMeta({
  layout: "restaurateur",
  middleware: ["auth-restaurateur"],
});
useHead({
  title: t("meta.profil_resto_title"),
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    {
      name: "description",
      content: t("meta.profil_resto_description"),
    },
  ],
});

useSeoMeta({
  title: t("meta.profil_resto_title"),
  ogTitle: t("meta.profil_resto_title"),
  description: t("meta.profil_resto_description"),
  ogDescription: t("meta.profil_resto_description"),
  ogImage: "/images/profil-resto.jpg",
  twitterCard: "summary_large_image",
});

const userStore = useUserStore();
const currentUser = computed(() => userStore.currentUser);

const restaurantData = ref<any>(null);

const fetchMyRestaurant = async () => {
  try {
    const api = useApi();
    const resto: any = await api("/restaurants/me");
    if (resto && resto.id) {
      restaurantData.value = resto;
    }
  } catch (err) {
    console.error("Impossible de récupérer le restaurant", err);
  }
};

onMounted(() => {
  fetchMyRestaurant();
});

const formData = ref({
  name: "",
  email: currentUser.value?.email || "",
  password: "",
  confirmPassword: "",
  imageUrl: "",
  description: "",
  lieu: "",
});

const error = ref("");
const success = ref("");

const fillFormData = () => {
  if (restaurantData.value) {
    formData.value.name = restaurantData.value.nom || "";
    formData.value.imageUrl = restaurantData.value.imageUrl || "";
    formData.value.description = restaurantData.value.description || "";
    formData.value.lieu = restaurantData.value.lieu || "";
  }
};

watch(
  restaurantData,
  () => {
    fillFormData();
  },
  { immediate: true },
);

// Valider le formulaire
const validateForm = () => {
  if (!formData.value.name || !formData.value.email) {
    error.value = "Le nom et l'email sont obligatoires";
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.value.email)) {
    error.value = "L'email n'est pas valide";
    return false;
  }

  if (
    formData.value.password &&
    formData.value.password !== formData.value.confirmPassword
  ) {
    error.value = "Les mots de passe ne correspondent pas";
    return false;
  }

  return true;
};

// Mettre à jour le profil/restaurant
const updateProfile = async () => {
  error.value = "";
  success.value = "";

  if (!validateForm()) return;

  try {
    // 1. MAJ du User (email/password) si modifié
    if (
      formData.value.email !== currentUser.value?.email ||
      formData.value.password
    ) {
      await userStore.updateProfile({
        name: currentUser.value?.name,
        email: formData.value.email,
        password: formData.value.password || currentUser.value?.password || "",
      });
    }

    // 2. MAJ du Restaurant (nom, desc, imageUrl)
    if (restaurantData.value) {
      const api = useApi();
      const updatedResto: any = await api("/restaurants/me", {
        method: "PATCH",
        body: {
          nom: formData.value.name,
          description: formData.value.description,
          imageUrl:
            formData.value.imageUrl || "https://placehold.co/400x400/png",
          lieu: formData.value.lieu || "Adresse à définir",
        },
      });
      restaurantData.value = updatedResto;
    }

    success.value = "Profil et restaurant mis à jour avec succès";
  } catch (err: any) {
    error.value = err.message || "Erreur lors de la mise à jour";
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>{{ t("restaurants.profil") }}</h1>

      <!-- Mode édition -->
      <form class="form-group" @submit.prevent="updateProfile">
        <div class="input-group">
          <label>{{ t("auth.nom_label") }}</label>
          <input
            v-model="formData.name"
            type="text"
            required
            placeholder="Votre nom"
          />
        </div>

        <div class="input-group">
          <label>{{ t("auth.email_label") }}</label>
          <input
            v-model="formData.email"
            type="email"
            required
            placeholder="votre@email.com"
          />
        </div>

        <div class="input-group">
          <label>URL de l'image de couverture</label>
          <input
            v-model="formData.imageUrl"
            type="url"
            placeholder="URL de l'image (ex: https://...)"
          />
        </div>

        <div class="input-group">
          <label>Adresse du restaurant</label>
          <input
            v-model="formData.lieu"
            type="text"
            placeholder="Adresse complète"
          />
        </div>

        <div class="input-group">
          <label>Description du restaurant</label>
          <textarea
            v-model="formData.description"
            placeholder="Description détaillée de votre restaurant"
            rows="4"
          ></textarea>
        </div>

        <div class="input-group">
          <label>{{ t("auth.update_password") }}</label>
          <input
            v-model="formData.password"
            type="password"
            :placeholder="t('auth.password_placeholder')"
          />
        </div>

        <div class="input-group" v-if="formData.password">
          <label>{{ t("auth.confirm_password") }}</label>
          <input
            v-model="formData.confirmPassword"
            type="password"
            :placeholder="t('auth.confirm_password')"
          />
        </div>

        <button type="submit">{{ t("common.save") }}</button>
      </form>

      <!-- Messages -->
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>
    </div>
  </div>
</template>

<style>
@import "@/assets/css/pages/auth.css";
</style>
