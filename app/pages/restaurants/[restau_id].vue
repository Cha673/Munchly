<!-- Page détail d'un restaurant
 Fonctionnalités : 
 - affichage des données du restaurant
 - listing des plats
 - au clique sur un plat mène vers la page détail du plat -->
<script setup lang="ts">
definePageMeta({
  layout: "user",
  middleware: ["auth-user"],
  validate: (route) => !isNaN(parseInt(route.params.restau_id as string)),
});

import { ref, computed, watchEffect } from "vue";
import { useRestaurantsStore } from "~/stores/restaurants/restaurants";
import type { Plat } from "~/types/plats/plats";
import Card from "~/components/Card.vue";

const route = useRoute();
const restaurantId = Number(route.params.restau_id);
const restaurantsStore = useRestaurantsStore();

// Restaurant courant
const restaurant = computed(() =>
  restaurantsStore.getRestaurantById(restaurantId)
);

const plats = ref<Plat[]>([]);
const search = ref("");
const loading = ref(false);

// Rediriger si le restaurant n'existe pas
watchEffect(() => {
  if (!loading.value && !restaurant.value) {
    navigateTo("/restaurants");
  }
});

// Récupération des plats via l'API
const fetchPlats = async () => {
  loading.value = true;
  const { data } = await useFetch<Plat[]>("/api/plats", {
    params: {
      restaurantId,
      search: search.value,
    },
  });
  plats.value = data.value || [];
  loading.value = false;
};

// Rechercher les plats
const searchPlats = async () => {
  await fetchPlats();
};

// Affichage des plats (tous ou filtrés par l’API)
const displayedPlats = computed(() => plats.value);

// Charger les plats initialement
await fetchPlats();
</script>

<template>
  <div>
    <!-- En-tête du restaurant -->
    <div v-if="restaurant" class="mb-8">
      <div>
        <img :src="restaurant.imageUrl" :alt="restaurant.nom" />
        <div class="p-6">
          <h1>{{ restaurant.nom }}</h1>
          <p>{{ restaurant.lieu }}</p>
          <p>{{ restaurant.description }}</p>
        </div>
      </div>
    </div>

    <!-- Moteur de recherche -->
    <div class="mb-4">
      <input v-model="search" placeholder="Rechercher un plat..." />
      <button @click="searchPlats">Rechercher</button>
    </div>

    <!-- Liste des plats -->
    <div>
      <h2>Carte des plats</h2>

      <p v-if="loading">Chargement des plats...</p>

      <div v-else>
        <NuxtLink
          v-for="plat in displayedPlats"
          :key="plat.id"
          :to="`/plats/${plat.id}`"
        >
          <Card
            :imageUrl="plat.imageUrl"
            :nom="plat.nom"
            :subtitle="plat.description + ' - ' + plat.prix + '€'"
          />
        </NuxtLink>

        <p v-if="displayedPlats.length === 0">
          Aucun plat disponible pour le moment
        </p>
      </div>
    </div>
  </div>
</template>
