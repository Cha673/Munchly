// API Route pour la création d'une nouvelle commande
//  Fonctionnalités :
//   - Validation des données de la commande (restaurantId, clientId, items, total)
//   - Sauvegarde dans le fichier orders.json avec un ID unique et date
//   - Gestion des erreurs avec retours appropriés
//

import { readFileSync, writeFileSync, existsSync } from "fs";
import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    // Lire le corps de la requête
    const body = await readBody(event);
    console.log("Nouvelle commande reçue:", body);

    // Vérifier les champs requis
    if (!body.restaurantId || !body.clientId || !body.items || !body.total) {
      return createError({
        statusCode: 400,
        message: "Données de commande incomplètes",
      });
    }

    const filePath = "./server/api/data/orders.json";
    let orders = [];

    // Lire le fichier existant ou créer un nouveau
    if (existsSync(filePath)) {
      const fileContent = readFileSync(filePath, "utf-8");
      const ordersData = JSON.parse(fileContent);
      orders = ordersData.orders || [];
    }

    // Créer la nouvelle commande avec un ID unique
    const newOrder = {
      id: Date.now(),
      ...body,
      date: new Date().toISOString(),
    };

    // Ajouter la commande et sauvegarder
    orders.push(newOrder);
    console.log("Sauvegarde de la commande:", newOrder);

    writeFileSync(filePath, JSON.stringify({ orders }, null, 2), "utf-8");
    return newOrder;
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    return createError({
      statusCode: 500,
      message: "Erreur lors de la création de la commande",
    });
  }
});
