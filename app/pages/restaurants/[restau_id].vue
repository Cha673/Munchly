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
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { $localePath } = useNuxtApp();

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

watchEffect(() => {
  if (restaurant.value) {
    useHead({
      title: t("restaurants.details.title", { name: restaurant.value.nom }),
      meta: [
        {
          name: "description",
          content: t("restaurants.details.description", {
            name: restaurant.value.nom,
            description: restaurant.value.description,
          }),
        },
        { name: "robots", content: "noindex, nofollow" },
      ],
    });

    useSeoMeta({
      title: t("restaurants.details.title", { name: restaurant.value.nom }),
      ogTitle: t("restaurants.details.title", { name: restaurant.value.nom }),
      description: t("restaurants.details.description", {
        name: restaurant.value.nom,
        description: restaurant.value.description,
      }),
      ogDescription: t("restaurants.details.description", {
        name: restaurant.value.nom,
        description: restaurant.value.description,
      }),
      ogImage: restaurant.value.imageUrl,
      twitterCard: "summary_large_image",
    });
  }
  if (!loading.value && !restaurant.value) {
    navigateTo($localePath("/restaurants"));
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
  <div class="restaurant-detail">
    <!-- En-tête du restaurant -->
    <div v-if="restaurant" class="restaurant-header">
      <div class="hero-image">
        <img :src="restaurant.imageUrl" :alt="restaurant.nom" />
        <div class="overlay"></div>
      </div>
      <div class="restaurant-info">
        <h1>{{ restaurant.nom }}</h1>
        <p class="location">{{ restaurant.lieu }}</p>
        <p class="description">{{ restaurant.description }}</p>
      </div>
    </div>

    <!-- Section des plats -->
    <div class="menu-section">
      <div class="search-container">
        <div class="search-box">
          <input
            v-model="search"
            :placeholder="t('restaurants.dishes_search_placeholder')"
            @keyup.enter="searchPlats"
          />
          <button @click="searchPlats" class="search-button">
            {{ t("restaurants.search_button") }}
          </button>
        </div>
      </div>

      <h2>{{ t("restaurants.menu_title") }}</h2>

      <div v-if="loading" class="loading-message">
        {{ t("restaurants.loading_dishes") }}
      </div>

      <div v-else>
        <div class="plats-grid">
          <NuxtLink
            v-for="plat in displayedPlats"
            :key="plat.id"
            :to="$localePath(`/plats/${plat.id}`)"
            class="plat-link"
          >
            <Card
              :imageUrl="plat.imageUrl"
              :nom="plat.nom"
              :subtitle="plat.description + ' - ' + plat.prix + '€'"
            />
          </NuxtLink>
        </div>

        <p v-if="displayedPlats.length === 0" class="no-results">
          {{ t("restaurants.no_dishes") }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.restaurant-detail {
  background-color: #f9fafb;
  min-height: calc(100vh - 80px);
}

.restaurant-header {
  position: relative;
  margin-bottom: 3rem;
}

.hero-image {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-image .overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.7)
  );
}

.restaurant-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  color: white;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}

.restaurant-info h1 {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.restaurant-info .location {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.restaurant-info .description {
  font-size: 1rem;
  opacity: 0.8;
  max-width: 800px;
}

.menu-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

.menu-section h2 {
  text-align: center;
  font-size: 2rem;
  color: #374151;
  font-weight: 600;
  margin: 3rem 0;
  position: relative;
}

.menu-section h2::after {
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
  margin: 0 auto 2rem;
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

.plats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 250px));
  justify-content: center;
  gap: 2rem;
  margin: 0 auto;
}

.plat-link {
  text-decoration: none;
  color: inherit;
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

@media (max-width: 1024px) {
  .hero-image {
    height: 300px;
  }

  .restaurant-info h1 {
    font-size: 2rem;
  }

  .plats-grid {
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
  .hero-image {
    height: 250px;
  }

  .restaurant-info {
    padding: 1.5rem;
  }

  .restaurant-info h1 {
    font-size: 1.75rem;
  }

  .menu-section {
    padding: 0 1.5rem 3rem;
  }

  .menu-section h2 {
    font-size: 1.75rem;
    margin: 2rem 0;
  }

  .plats-grid {
    grid-template-columns: minmax(0, 400px);
  }
}
</style>
