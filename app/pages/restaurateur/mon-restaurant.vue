<!-- Page de gestion du restaurant pour le restaurateur -->
<script setup lang="ts">
import { ref, computed } from "vue";
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

const formData = ref({
  name: currentUser.value?.name || "",
  email: currentUser.value?.email || "",
  password: "",
  confirmPassword: "",
});

const error = ref("");
const success = ref("");
const isEditing = ref(false);

// Fonction pour commencer l'édition
const startEditing = () => {
  formData.value = {
    name: currentUser.value?.name || "",
    email: currentUser.value?.email || "",
    password: "",
    confirmPassword: "",
  };
  isEditing.value = true;
};

// Fonction pour annuler l'édition
const cancelEditing = () => {
  isEditing.value = false;
  error.value = "";
  success.value = "";
};

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

// Mettre à jour le profil
const updateProfile = async () => {
  error.value = "";
  success.value = "";

  if (!validateForm()) return;

  try {
    await userStore.updateProfile({
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password || currentUser.value?.password || "",
    });
    success.value = "Profil mis à jour avec succès";
    isEditing.value = false;
  } catch (err: any) {
    error.value = err.message || "Erreur lors de la mise à jour";
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>{{ t("restaurants.profil") }}</h1>

      <!-- Mode lecture -->
      <div v-if="!isEditing">
        <div class="form-group">
          <div class="input-group">
            <label>{{ t("auth.nom_label") }}</label>
            <div class="info-display">{{ currentUser?.name }}</div>
          </div>

          <div class="input-group">
            <label>{{ t("auth.email_label") }}</label>
            <div class="info-display">{{ currentUser?.email }}</div>
          </div>

          <button @click="startEditing">{{ t("auth.update_profil") }}</button>
        </div>
      </div>

      <!-- Mode édition -->
      <div v-else class="form-group">
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
          <label>{{ t("auth.update_password") }}</label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="{{ t('auth.password_placeholder') }}"
          />
        </div>

        <div class="input-group" v-if="formData.password">
          <label>{{ t("auth.confirm_password") }}</label>
          <input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="{{ t('auth.confirm_password') }}"
          />
        </div>

        <button @click.prevent="updateProfile">{{ t("common.save") }}</button>
        <p class="auth-link">
          <a href="#" @click.prevent="cancelEditing">{{
            t("common.cancel")
          }}</a>
        </p>
      </div>

      <!-- Messages -->
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>
    </div>
  </div>
</template>

<style>
@import "@/assets/css/pages/auth.css";

/* Style supplémentaire pour l'affichage en mode lecture */
.info-display {
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #374151;
}
</style>
