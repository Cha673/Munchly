<script setup lang="ts">
definePageMeta({
  layout: "restaurateur",
  middleware: ["auth-restaurateur"],
});

import { ref, computed, onMounted } from "vue";
import { useUserStore } from "~/stores/users/user";
import type { Plat } from "~/types/plats/plats";

const userStore = useUserStore();
const currentUser = computed(() => userStore.currentUser);

// Vérifier que l'utilisateur est connecté et est un restaurateur
if (!currentUser.value || currentUser.value.role !== "restaurateur") {
  navigateTo("/login");
}

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
      <h1>Mes Plats</h1>
      <NuxtLink to="/restaurateur/add_plat" class="add-button">
        Ajouter un plat
      </NuxtLink>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="loading">Chargement...</div>

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
            Supprimer
          </button>
        </template>
      </Card>

      <div v-if="plats.length === 0" class="no-plats">
        Aucun plat disponible
      </div>
    </div>
  </div>
</template>

<style scoped>
.plats-container {
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.add-button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.plats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.delete-button {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  cursor: pointer;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.no-plats {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: #666;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>
