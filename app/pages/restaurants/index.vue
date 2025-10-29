<!-- Page listing des restaurants, 
 au clique sur un restaurant, on est mené vers la page détail du restaurant  -->
<script setup lang="ts">
useHead({
  title: "Restaurants près de chez vous - Munchly",
  meta: [
    {
      name: "description",
      content:
        "Parcourez notre sélection de restaurants et découvrez une large gamme de cuisines. Livraison rapide garantie.",
    },
    { name: "robots", content: "noindex, nofollow" },
  ],
});

useSeoMeta({
  title: "Restaurants près de chez vous - Munchly",
  ogTitle: "Restaurants près de chez vous - Munchly",
  description:
    "Parcourez notre sélection de restaurants et découvrez une large gamme de cuisines. Livraison rapide garantie.",
  ogDescription:
    "Parcourez notre sélection de restaurants et découvrez une large gamme de cuisines. Livraison rapide garantie.",
});
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
  <div class="restaurants-page">
    <div class="page-header">
      <h1>Nos Restaurants</h1>
      <div class="search-container">
        <div class="search-box">
          <input
            v-model="search"
            placeholder="Rechercher un restaurant..."
            @keyup.enter="searchRestaurants"
          />
          <button @click="searchRestaurants" class="search-button">
            Rechercher
          </button>
        </div>
      </div>
    </div>

    <div class="content-section">
      <p v-if="loading" class="loading-message">Chargement...</p>

      <div v-if="!loading">
        <!-- Résultats de recherche -->
        <template v-if="search && results.length">
          <div class="resto-grid">
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
          </div>
        </template>

        <!-- Aucun résultat -->
        <p v-else-if="search && !results.length" class="no-results">
          Aucun restaurant ne correspond à votre recherche
        </p>

        <!-- Liste complète -->
        <template v-else>
          <div class="resto-grid">
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
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.restaurants-page {
  padding: 2rem;
  background-color: #f9fafb;
  min-height: calc(100vh - 80px);
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 3rem;
  text-align: center;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #374151;
  font-weight: 600;
  margin-bottom: 2rem;
  position: relative;
}

.page-header h1::after {
  content: "";
  position: absolute;
  bottom: -0.75rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #4b5563;
  border-radius: 2px;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-box {
  display: flex;
  gap: 1rem;
  background: white;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.search-box input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #374151;
  transition: all 0.2s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #4b5563;
  box-shadow: 0 0 0 3px rgb(75 85 99 / 0.1);
}

.search-box input::placeholder {
  color: #9ca3af;
}

.search-button {
  background-color: #4b5563;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.search-button:hover {
  background-color: #374151;
}

.content-section {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-message {
  text-align: center;
  color: #4b5563;
  font-size: 1.1rem;
  padding: 2rem;
}

.no-results {
  text-align: center;
  color: #4b5563;
  font-size: 1.1rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.resto-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 250px));
  justify-content: center;
  gap: 2rem;
  margin: 0 auto;
}

.resto-grid a {
  text-decoration: none;
  color: inherit;
}

@media (max-width: 1024px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .resto-grid {
    grid-template-columns: repeat(2, minmax(0, 300px));
    gap: 1.5rem;
  }

  .search-box {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .restaurants-page {
    padding: 1.5rem;
  }

  .page-header h1 {
    font-size: 1.75rem;
  }

  .resto-grid {
    grid-template-columns: minmax(0, 400px);
  }
}
</style>
