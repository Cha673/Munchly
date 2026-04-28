// API Route pour la recherche de restaurants
//  Fonctionnalités :
//   - Recherche de restaurants
//   - Recherche insensible à la casse

import restaurantsData from "../data/restaurants.json";
import type { Restaurant } from "~/types/restaurants/restaurants";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const search = (query.q as string)?.toLowerCase() || "";

  if (!search) {
    return restaurantsData;
  }

  const filtered = (restaurantsData as Restaurant[]).filter(
    (r) =>
      r.nom.toLowerCase().includes(search) ||
      r.lieu.toLowerCase().includes(search)
  );

  return filtered;
});
