<!-- Page listing des restaurants, 
 au clique sur un restaurant, on est mené vers la page détail du restaurant  -->
<script setup lang="ts">
definePageMeta({
  ssr: true,
  layout: "user",
  middleware: ["auth-user"],
});

import Card from "~/components/Card.vue";
import { useRestaurantsStore } from "~/stores/restaurants/restaurants";

const restaurantsStore = useRestaurantsStore();
const search = ref<string>("");
const loading = ref<boolean>(false);

const restaurants = computed(() => restaurantsStore.getAllRestaurants);
const results = computed(() => restaurantsStore.getFilteredRestaurants);

// Rechercher un restaurant
const searchRestaurants = () => {
  loading.value = true;
  restaurantsStore.searchRestaurants(search.value);
  loading.value = false;
};
</script>

<template>
  <div>
    <h1>Restaurants</h1>

    <input v-model="search" placeholder="Rechercher un restaurant..." />
    <button @click="searchRestaurants">Rechercher</button>

    <p v-if="loading">Chargement...</p>

    <div v-if="!loading">
      <!-- Résultats de recherche -->
      <template v-if="search && results.length">
        <NuxtLink
          v-for="resto in results"
          :key="resto.id"
          :to="`/restaurants/${resto.id}`"
        >
          <Card
            :imageUrl="resto.imageUrl"
            :nom="resto.nom"
            :subtitle="resto.lieu"
          />
        </NuxtLink>
      </template>

      <!-- Aucun résultat -->
      <p v-else-if="search && !results.length">Aucun restaurant trouvé</p>

      <!-- Liste complète -->
      <template v-else>
        <NuxtLink
          v-for="resto in restaurants"
          :key="resto.id"
          :to="`/restaurants/${resto.id}`"
        >
          <Card
            :imageUrl="resto.imageUrl"
            :nom="resto.nom"
            :subtitle="resto.lieu"
          />
        </NuxtLink>
      </template>
    </div>
  </div>
</template>
