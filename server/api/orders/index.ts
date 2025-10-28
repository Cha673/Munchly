// API Route pour la récupération des commandes
//  Fonctionnalités :
//   - Récupération de toutes les commandes
//   - Filtrage optionnel par restaurantId
//   - Vérification de l'existence du fichier de données
//
// Paramètres de requête :
//  - restaurantId (optionnel) : Filtre les commandes pour un restaurant spécifique
//
// Retours :
//  - Sans filtre : Tableau de toutes les commandes
//  - Avec restaurantId : Tableau des commandes du restaurant

import { readFileSync, existsSync } from "fs";
import { defineEventHandler, getQuery, createError } from "h3";
import type { Order } from "~/types/orders/orders";

export default defineEventHandler((event) => {
  try {
    const query = getQuery(event);
    const { restaurantId } = query;

    const filePath = "./server/api/data/orders.json";
    if (!existsSync(filePath)) {
      return [];
    }

    // Lecture du fichier JSON des commandes
    const ordersData = JSON.parse(readFileSync(filePath, "utf-8"));
    const orders = Array.isArray(ordersData.orders) ? ordersData.orders : [];

    // Si un restaurantId est fourni, filtrer les commandes pour ce restaurant
    if (restaurantId) {
      const filteredOrders = orders.filter((order: Order) => {
        const match = order.restaurantId.toString() === restaurantId.toString();
        return match;
      });

      return filteredOrders;
    }

    return orders;
  } catch (error) {
    return createError({
      statusCode: 500,
      message: "Erreur lors de la récupération des commandes",
    });
  }
});
