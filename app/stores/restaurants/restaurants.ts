import { defineStore } from "pinia";
import type { Restaurant } from "~/types/restaurants/restaurants";
import restaurantsData from "../../../server/api/data/restaurants.json";

export const useRestaurantsStore = defineStore("restaurants", {
  state: () => ({
    restaurants: restaurantsData as Restaurant[],
    filteredRestaurants: [] as Restaurant[],
  }),
  getters: {
    getAllRestaurants: (state) => state.restaurants,
    getRestaurantById: (state) => {
      return (id: number) => state.restaurants.find((r) => r.id === id);
    },
    getFilteredRestaurants: (state) => state.filteredRestaurants,
    getFeaturedRestaurants: (state) => state.restaurants.slice(0, 4),
  },
  actions: {
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
