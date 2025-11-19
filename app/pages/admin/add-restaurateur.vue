<!-- Page d'ajout d'un nouveau restaurateur
  Formulaire permettant à l'administrateur d'ajouter un nouveau compte restaurateur
 -->
<script setup lang="ts">
import { useUserStore } from "~/stores/users/user";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { $localePath } = useNuxtApp();

definePageMeta({
  layout: "admin",
  middleware: ["auth-admin"],
});
useHead({
  title: t("meta.addrestaurant_title"),
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    {
      name: "description",
      content: t("meta.addrestaurant_description"),
    },
  ],
});

useSeoMeta({
  title: t("meta.addrestaurant_title"),
  ogTitle: t("meta.addrestaurant_title"),
  description: t("meta.addrestaurant_description"),
  ogDescription: t("meta.addrestaurant_description"),
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
    await navigateTo($localePath("/admin"));
  } catch (error: any) {
    alert(error.message);
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>{{ t("admin.add_resto") }}</h1>

      <div class="form-group">
        <div class="input-group">
          <label for="name">{{ t("auth.nom_label") }}</label>
          <input
            id="name"
            v-model="newUser.name"
            type="text"
            placeholder="t('admin.name_resto')"
            required
          />
        </div>

        <div class="input-group">
          <label for="email">{{ t("auth.email_label") }}</label>
          <input
            id="email"
            v-model="newUser.email"
            type="email"
            placeholder="t('admin.mail_resto')"
            required
          />
        </div>

        <div class="input-group">
          <label for="password">{{ t("auth.password_label") }}</label>
          <input
            id="password"
            v-model="newUser.password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" @click.prevent="handleAddRestaurateur">
          {{ t("admin.add_resto") }}
        </button>
      </div>

      <p class="auth-link">
        <NuxtLink :to="$localePath('/admin')">{{
          t("auth.back_dashboard")
        }}</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style>
@import "@/assets/css/pages/auth.css";
</style>
