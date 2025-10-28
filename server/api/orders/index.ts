import { readFileSync, existsSync } from "fs";
import { defineEventHandler, getQuery, createError } from "h3";
import type { Order } from "~/types/orders/orders";

export default defineEventHandler((event) => {
  try {
    const query = getQuery(event);
    const { restaurantId } = query;

    console.log("GET /api/orders - restaurantId:", restaurantId);

    const filePath = "./server/api/data/orders.json";
    if (!existsSync(filePath)) {
      console.log("Fichier orders.json n'existe pas encore");
      return [];
    }

    // Lecture du fichier JSON des commandes
    const ordersData = JSON.parse(readFileSync(filePath, "utf-8"));
    const orders = Array.isArray(ordersData.orders) ? ordersData.orders : [];

    console.log("Nombre total de commandes:", orders.length);

    // Si un restaurantId est fourni, filtrer les commandes pour ce restaurant
    if (restaurantId) {
      const filteredOrders = orders.filter((order: Order) => {
        const match = order.restaurantId.toString() === restaurantId.toString();
        console.log(
          `Commande ${order.id} - restaurantId: ${order.restaurantId} - match: ${match}`
        );
        return match;
      });

      console.log(
        `Commandes trouvées pour le restaurant ${restaurantId}:`,
        filteredOrders.length
      );
      return filteredOrders;
    }

    return orders;
  } catch (error) {
    console.error("Erreur lors de la lecture des commandes:", error);
    return createError({
      statusCode: 500,
      message: "Erreur lors de la récupération des commandes",
    });
  }
});
