<!-- Page d'un resturateur pour ajouter un plat -->
<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "~/stores/users/user";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

definePageMeta({
  layout: "restaurateur",
  middleware: ["auth-restaurateur"],
});

useHead({
  title: t("meta.adddish_title"),
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    {
      name: "description",
      content: t("adddish_description"),
    },
  ],
});

useSeoMeta({
  title: t("meta.adddish_title"),
  ogTitle: t("meta.adddish_title"),
  description: t("adddish_description"),
  ogDescription: t("adddish_description"),
  ogImage: "/images/munchly-logo.jpg",
  twitterCard: "summary_large_image",
});

const userStore = useUserStore();
const currentUser = computed(() => userStore.currentUser);

// Vérifier que l'utilisateur est connecté et est un restaurateur
if (!currentUser.value || currentUser.value.role !== "restaurateur") {
  navigateTo("/login");
}

const loading = ref(false);
const error = ref<string | null>(null);
const newPlat = ref({
  nom: "",
  description: "",
  prix: "",
  imageUrl: "",
});

// Ajouter un nouveau plat
const addPlat = async () => {
  if (
    !newPlat.value.nom ||
    !newPlat.value.description ||
    !newPlat.value.prix ||
    !newPlat.value.imageUrl
  ) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  if (!currentUser.value?.id) {
    alert("Erreur : utilisateur non identifié");
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    await $fetch("/api/plats", {
      method: "POST",
      body: {
        restaurantId: currentUser.value.id,
        nom: newPlat.value.nom,
        description: newPlat.value.description,
        prix: parseFloat(newPlat.value.prix),
        imageUrl: newPlat.value.imageUrl,
      },
    });

    // Rediriger vers la liste des plats après l'ajout
    navigateTo("/restaurateur/plats");
  } catch (err) {
    console.error("Erreur lors de l'ajout du plat:", err);
    error.value = "Erreur lors de l'ajout du plat";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="add-plat-container">
    <div class="header">
      <h1>{{ t("dishes.add_dish") }}</h1>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Formulaire d'ajout de plat -->
    <form @submit.prevent="addPlat" class="plat-form">
      <div class="form-group">
        <label>{{ t("dishes.name_dish") }}</label>
        <input
          v-model="newPlat.nom"
          required
          placeholder="Ex: Pizza Margherita"
        />
      </div>

      <div class="form-group">
        <label>{{ t("dishes.description_dish") }}</label>
        <textarea
          v-model="newPlat.description"
          required
          :placeholder="t('dishes.description_dish_two')"
        ></textarea>
      </div>

      <div class="form-group">
        <label>{{ t("dishes.price") }} (€)</label>
        <input
          v-model="newPlat.prix"
          type="number"
          step="0.01"
          required
          placeholder="Ex: 12.90"
        />
      </div>

      <div class="form-group">
        <label>{{ t("url") }}</label>
        <input
          v-model="newPlat.imageUrl"
          type="url"
          required
          placeholder="https://..."
        />
      </div>

      <div class="form-buttons">
        <NuxtLink to="/restaurateur/plats" class="cancel-button">
          {{ t("common.cancel") }}
        </NuxtLink>
        <button type="submit" class="submit-button" :disabled="loading">
          {{ loading ? t("common.loading") : t("dishes.add_dish") }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-plat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
  background-color: #f9fafb;
}

.header {
  margin-bottom: 2rem;
  text-align: center;
}

.header h1 {
  color: #374151;
  font-size: 1.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  position: relative;
}

.plat-form {
  background-color: white;
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.error-message {
  background-color: #fef2f2;
  color: #ef4444;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  border: 1px solid #fee2e2;
  font-size: 0.95rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #374151;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4b5563;
  box-shadow: 0 0 0 3px rgb(75 85 99 / 0.1);
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-button,
.cancel-button {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.95rem;
  text-align: center;
  transition: all 0.2s ease;
}

.submit-button {
  background-color: #4b5563;
  color: white;
  border: none;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #374151;
  transform: translateY(-1px);
}

.submit-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.cancel-button {
  background: white;
  color: #4b5563;
  border: 2px solid #4b5563;
  text-decoration: none;
}

.cancel-button:hover {
  background-color: #4b5563;
  color: white;
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .add-plat-container {
    padding: 1rem;
  }

  .plat-form {
    padding: 1.5rem;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .form-buttons {
    flex-direction: column-reverse;
  }

  .submit-button,
  .cancel-button {
    width: 100%;
  }
}
</style>
