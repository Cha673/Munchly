import type { AuthenticatedWebSocket } from "../types/socket.js";

// Map pour stocker les connexions WebSocket par restaurantId
const restaurantConnections = new Map<string, Set<AuthenticatedWebSocket>>();

/**
 * Enregistrer une connexion WebSocket pour un restaurant
 *
 * Cette fonction:
 * 1. Vérifie si le restaurantId existe déjà dans la Map
 * 2. Si non, crée un nouveau Set pour ce restaurantId
 * 3. Ajoute le socket au Set correspondant
 */
export const registerRestaurantConnection = (
  restaurantId: string,
  socket: AuthenticatedWebSocket,
) => {
  if (!restaurantConnections.has(restaurantId)) {
    restaurantConnections.set(restaurantId, new Set<AuthenticatedWebSocket>());
  }
  restaurantConnections.get(restaurantId)!.add(socket);
  console.log(
    `[WS] Restaurant ${restaurantId} connecté. Total: ${restaurantConnections.get(restaurantId)!.size}`,
  );
};

/**
 * Désenregistrer une connexion WebSocket
 *
 * Cette fonction:
 * 1. Récupère le Set de connections pour ce restaurantId
 * 2. Supprime le socket du Set
 * 3. Si le Set est vide, supprime l'entrée de la Map
 */
export const unregisterRestaurantConnection = (
  restaurantId: string,
  socket: AuthenticatedWebSocket,
) => {
  const connections = restaurantConnections.get(restaurantId);
  if (connections) {
    connections.delete(socket);
    console.log(
      `[WS] Restaurant ${restaurantId} déconnecté. Restant: ${connections.size}`,
    );

    if (connections.size === 0) {
      restaurantConnections.delete(restaurantId);
      console.log(
        `[WS] Restaurant ${restaurantId} hors ligne (plus aucune connexion).`,
      );
    }
  }
};

/**
 * Envoyer une notification à tous les restaurateurs connectés
 *
 * Cette fonction:
 * 1. Récupère le Set de connections pour ce restaurantId
 * 2. Crée un message JSON avec l'event, les data et un timestamp
 * 3. Envoie ce message à chaque socket connecté
 * 4. Gère les erreurs d'envoi avec un try-catch et un console.error
 */
export const notifyRestaurant = (
  restaurantId: string,
  event: string,
  data: any,
) => {
  const connections = restaurantConnections.get(restaurantId);
  if (connections && connections.size > 0) {
    const message = JSON.stringify({
      event,
      data,
      timestamp: new Date().toISOString(),
    });

    connections.forEach((client) => {
      // 1 = WebSocket.OPEN
      if (client.socket?.readyState === 1) {
        try {
          client.socket.send(message);
        } catch (error) {
          console.error(
            `[WS] Erreur lors de l'envoi de la notification au restaurant ${restaurantId}:`,
            error,
          );
        }
      }
    });
    console.log(
      `[WS] Notification '${event}' envoyée à ${connections.size} connexions pour le restaurant ${restaurantId}`,
    );
  }
};
