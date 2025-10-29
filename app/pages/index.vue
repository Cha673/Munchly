<!-- Page d'accueil du site 
 Fonctionnalités : 
 - mène vers le listing des restaurants mais demande d'être connecté 
 - permet de se connecter/déconnecter -->
<script setup lang="ts">
definePageMeta({
  layout: "home",
});

import Card from "~/components/Card.vue";
import { useRestaurantsStore } from "~/stores/restaurants/restaurants";

interface Restaurant {
  id: number;
  nom: string;
  lieu: string;
  imageUrl: string;
}
const restaurantsStore = useRestaurantsStore();
const restaurants = computed(() => restaurantsStore.getFeaturedRestaurants);
</script>

<template>
  <div class="home">
    <!-- Bannière -->
    <div class="banner">
      <div class="banner-content">
        <h1>Découvrez les meilleurs restaurants</h1>
        <p>Des plats délicieux livrés directement chez vous</p>
        <NuxtLink to="/login" class="cta-button"> Se connecter </NuxtLink>
      </div>
    </div>

    <!-- Section Restaurants -->
    <section class="featured-restaurants">
      <h2>Restaurants populaires</h2>
      <div class="restaurants-grid">
        <Card
          v-for="restaurant in restaurants"
          :key="restaurant.id"
          :imageUrl="restaurant.imageUrl"
          :nom="restaurant.nom"
          :subtitle="restaurant.lieu"
        />
      </div>
      <div class="view-all">
        <NuxtLink to="/login" class="view-all-button">
          Se connecter pour voir tous les restaurants
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
  background-color: #f9fafb;
  min-height: calc(100vh - 80px);
}

.banner {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url("https://images.unsplash.com/photo-1504674900247-0877df9cc836");
  background-size: cover;
  background-position: center;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  position: relative;
}

.banner::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, #f9fafb, transparent);
}

.banner-content {
  max-width: 800px;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

.banner h1 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.banner p {
  font-size: 1.5rem;
  margin-bottom: 2.5rem;
  font-weight: 400;
  opacity: 0.9;
}

.cta-button {
  background-color: #4b5563;
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.125rem;
  transition: all 0.2s ease;
  display: inline-block;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.cta-button:hover {
  background-color: #374151;
  transform: translateY(-1px);
  box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.1),
    0 3px 6px -1px rgba(0, 0, 0, 0.06);
}

.featured-restaurants {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.featured-restaurants h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
  color: #374151;
  font-weight: 600;
  position: relative;
}

.featured-restaurants h2::after {
  content: "";
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #4b5563;
  border-radius: 2px;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;
  justify-content: center;
  margin: 0 auto;
}

.view-all {
  text-align: center;
  margin-top: 2rem;
}

.view-all-button {
  background-color: transparent;
  color: #4b5563;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease;
  border: 2px solid #4b5563;
  display: inline-block;
}

.view-all-button:hover {
  background-color: #4b5563;
  color: white;
}

@media (max-width: 1024px) {
  .restaurants-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .banner h1 {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .banner {
    height: 400px;
  }

  .banner h1 {
    font-size: 2rem;
  }

  .banner p {
    font-size: 1.125rem;
  }

  .restaurants-grid {
    grid-template-columns: 1fr;
  }

  .featured-restaurants {
    padding: 3rem 1.5rem;
  }

  .featured-restaurants h2 {
    font-size: 1.75rem;
    margin-bottom: 2.5rem;
  }

  .cta-button,
  .view-all-button {
    width: auto;
    text-align: center;
    padding: 1rem;
  }
}
</style>
