// Store Pinia pour les restaurants
import { defineStore } from "pinia";
import type { Restaurant } from "~/types/restaurants/restaurants";
import restaurantsData from "../../../server/api/data/restaurants.json";

export const useRestaurantsStore = defineStore("restaurants", {
  state: () => ({
    restaurants: restaurantsData as Restaurant[],
    filteredRestaurants: [] as Restaurant[],
  }),
  getters: {
    //rechercher tous les restaurants
    getAllRestaurants: (state) => state.restaurants,
    // rechercher un restaurant par son ID
    getRestaurantById: (state) => {
      return (id: number) => state.restaurants.find((r) => r.id === id);
    },
    // rechercher des restaurants par filtre
    getFilteredRestaurants: (state) => state.filteredRestaurants,
    // afficher seulement 4 restaurants mis en avant, pour la page d'accueil
    getFeaturedRestaurants: (state) => state.restaurants.slice(0, 4),
  },
  actions: {
    //rechercher des restaurants
    searchRestaurants(query: string) {
      if (!query.trim()) {
        this.filteredRestaurants = [];
        return;
      }
      const searchTerm = query.toLowerCase();
      this.filteredRestaurants = this.restaurants.filter(
        (resto) =>
          resto.nom.toLowerCase().includes(searchTerm) ||
          resto.lieu.toLowerCase().includes(searchTerm)
      );
    },
  },
});
