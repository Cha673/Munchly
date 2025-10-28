<!-- Page d'accueil du site 
 Fonctionnalités : 
 - mène vers le listing des restaurants mais demande d'être connecté 
 - permet de se connecter/déconnecter -->
<script setup lang="ts">
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
        <NuxtLink to="/restaurants" class="cta-button">
          Voir tous les restaurants
        </NuxtLink>
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
        <NuxtLink to="/restaurants" class="view-all-button">
          Découvrir tous nos restaurants
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
}

.banner {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("https://images.unsplash.com/photo-1504674900247-0877df9cc836");
  background-size: cover;
  background-position: center;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.banner-content {
  max-width: 800px;
  padding: 0 20px;
}

.banner h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.banner p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.cta-button {
  background-color: #ff5a5f;
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #ff4246;
}

.featured-restaurants {
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 20px;
}

.featured-restaurants h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

.view-all {
  text-align: center;
}

.view-all-button {
  background-color: #4a90e2;
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
}

.view-all-button:hover {
  background-color: #357abd;
}

@media (max-width: 1024px) {
  .restaurants-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .banner h1 {
    font-size: 2rem;
  }

  .banner p {
    font-size: 1.2rem;
  }

  .restaurants-grid {
    grid-template-columns: 1fr;
  }
}
</style>
