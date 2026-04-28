<!-- Page de gestion des plats pour le restaurateur
 Fonctionnalités : 
 - listing des plats du restaurants
 - Suppression des plats
 - mène vers la page d'ajout d'un plat au clique sur le bouton correspondant -->

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "~/stores/users/user";
import type { Plat } from "~/types/plats/plats";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const { $localePath } = useNuxtApp();

definePageMeta({
  layout: "restaurateur",
  middleware: ["auth-restaurateur"],
});

useHead({
  title: t("meta.dish_resto_title"),
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    {
      name: "description",
      content: t("meta.dish_resto_description"),
    },
  ],
});

useSeoMeta({
  title: t("meta.dish_resto_title"),
  ogTitle: t("meta.dish_resto_title"),
  description: t("meta.dish_resto_description"),
  ogDescription: t("meta.dish_resto_description"),
  twitterCard: "summary_large_image",
});

const userStore = useUserStore();
const currentUser = computed(() => userStore.currentUser);

// États locaux
const plats = ref<Plat[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Charger les plats
const fetchPlats = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await useFetch<Plat[]>("/api/plats", {
      query: {
        restaurantId: currentUser.value?.id,
      },
    });
    plats.value = data.value || [];
  } catch (err) {
    console.error("Erreur lors de la récupération des plats:", err);
    error.value = "Erreur lors du chargement des plats";
  } finally {
    loading.value = false;
  }
};

// Charger les plats au montage du composant
onMounted(() => {
  fetchPlats();
});

// Supprimer un plat
const deletePlat = async (platId: number) => {
  if (!confirm("Voulez-vous vraiment supprimer ce plat ?")) return;

  loading.value = true;
  error.value = null;
  try {
    await $fetch(`/api/plats/${platId}`, {
      method: "DELETE",
    });
    await fetchPlats(); // Recharger la liste des plats
  } catch (err) {
    console.error("Erreur lors de la suppression du plat:", err);
    error.value = "Erreur lors de la suppression du plat";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="plats-container">
    <div class="header">
      <h1>{{ t("restaurants.list_dishes") }}</h1>
      <NuxtLink :to="$localePath('/restaurateur/add_plat')" class="add-button">
        {{ t("restaurants.add_dish") }}
      </NuxtLink>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="loading">{{ t("common.loading") }}</div>

    <!-- Liste des plats -->
    <div v-else class="plats-grid">
      <Card
        v-for="plat in plats"
        :key="plat.id"
        :imageUrl="plat.imageUrl"
        :nom="plat.nom"
        :subtitle="plat.prix + '€'"
      >
        <template #description>
          <p>{{ plat.description }}</p>
          <button @click="deletePlat(plat.id)" class="delete-button">
            {{ t("common.delete") }}
          </button>
        </template>
      </Card>

      <div v-if="plats.length === 0" class="no-plats">
        {{ t("restaurants.no_dishes") }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.plats-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem;
  background-color: #f9fafb;
  min-height: calc(100vh - 80px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  color: #374151;
  font-weight: 600;
  position: relative;
  margin: 0;
}

.header h1::after {
  content: "";
  position: absolute;
  bottom: -0.75rem;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: #4b5563;
  border-radius: 2px;
}

.add-button {
  background: #4b5563;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s ease;
}

.add-button:hover {
  background: #374151;
  transform: translateY(-1px);
}

.plats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.delete-button {
  background: white;
  color: #ef4444;
  border: 2px solid #ef4444;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  width: 100%;
  transition: all 0.2s ease;
}

.delete-button:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-1px);
}

.error-message {
  background-color: #fef2f2;
  color: #ef4444;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid #fee2e2;
  font-size: 1rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #4b5563;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-size: 1.1rem;
}

.no-plats {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: #4b5563;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .plats-container {
    padding: 1.5rem 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .header h1::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .add-button {
    width: 100%;
    text-align: center;
  }

  .plats-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
