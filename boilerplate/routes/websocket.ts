import { FastifyInstance, FastifyRequest } from "fastify";
import {
  registerRestaurantConnection,
  unregisterRestaurantConnection,
} from "../services/websocket.service.js";
import { Role, User } from "../generated/prisma/client.js";
import { WebSocket } from "@fastify/websocket";

export interface AuthenticatedSocket {
  user: User;
  restaurantId: string;
  socket: WebSocket;
}

enum WebSocketEvent {
  AUTH = "auth",
  PING = "ping",
  PONG = "pong",
  CONNECTED = "connected",
}

// Message types
interface AuthMessage {
  event: typeof WebSocketEvent.AUTH;
  token: string;
}

interface PingMessage {
  event: typeof WebSocketEvent.PING;
}

type WebSocketMessage = AuthMessage | PingMessage;

export const websocketRoutes = async (app: FastifyInstance) => {
  /**
   * WebSocket endpoint /ws/restaurant
   * Connecte un restaurateur pour recevoir les notifications en temps réel
   *
   * Flux de connexion:
   * 1. Attendre un event "authenticate" contenant le token JWT
   * 2. Valider le token et vérifier que l'utilisateur existe et a le rôle RESTAURANT
   * 3. Récupérer les données du restaurant associé à l'utilisateur
   * 4. Enregistrer la connexion WebSocket
   * 5. Gérer les messages entrants (ex: ping/pong)
   * 6. Gérer la déconnexion proprement
   */
  app.get(
    "/ws/restaurant",
    { websocket: true },
    async (socket: WebSocket, request: FastifyRequest) => {
      // 1. On prépare une variable mémorisant le restaurateur qui s'est connecté
      let authSocket: AuthenticatedSocket | null = null;
      try {
        try {
          socket.on("message", async (data: Buffer) => {
            // Lecture du message brut et transformation en objet compris par notre app.
            const message: WebSocketMessage = JSON.parse(data.toString());
            switch (message.event) {
              case WebSocketEvent.AUTH:
                try {
                  // A. Valider le token
                  const decoded = app.jwt.verify<{ id: string }>(message.token);

                  // B. Récupérer l'utilisateur
                  const user = await app.prisma.user.findUnique({
                    where: { id: decoded.id },
                  });

                  // C. Vérif stricte du rôle
                  if (!user || user.role !== Role.RESTAURANT) {
                    socket.close(1008, "Erreur: Rôle RESTAURANT requis.");
                    return; // Stoppe l'exécution
                  }

                  // D. Récupérer le restaurant associé à l'utilisateur
                  const restaurant = await app.prisma.restaurant.findFirst({
                    where: { ownerId: user.id },
                  });

                  if (!restaurant) {
                    socket.close(1008, "Erreur: Aucun restaurant associé.");
                    return;
                  }

                  // E. Remplir l'authSocket avec les données
                  authSocket = {
                    user: user,
                    restaurantId: restaurant.id,
                    socket: socket,
                  };

                  // F. Enregistrer la connexion
                  registerRestaurantConnection(restaurant.id, authSocket);

                  // G. Envoyer le message de confirmation
                  const confirmationMsg = {
                    event: WebSocketEvent.CONNECTED,
                    data: {
                      restaurantId: restaurant.id,
                      message: "Authentification WebSocket réussie.",
                    },
                    timestamp: new Date().toISOString(),
                  };
                  socket.send(JSON.stringify(confirmationMsg));
                } catch (jwtErr) {
                  // Si verify() plante (expiré, faux)
                  socket.close(1008, "Token JWT invalide ou expiré.");
                }
                break;
              case WebSocketEvent.PING:
                // On répond immédiatement avec un PONG
                socket.send(JSON.stringify({ event: WebSocketEvent.PONG }));
                break;
              default:
                console.warn(
                  `Message WebSocket inconnu reçu : ${(message as any).event}`,
                );
                break;
            }
          });

          // Listener "close" sur le socket :
          // Désenregistrer la connexion WebSocket quand le client se déconnecte
          socket.on("close", () => {
            // Si le socket avait réussi à s'authentifier (authSocket n'est plus null)
            if (authSocket) {
              unregisterRestaurantConnection(
                authSocket.restaurantId,
                authSocket,
              );
            }
          });

          // Listener "error" sur le socket :
          // Logger l'erreur et désenregistrer la connexion
          socket.on("error", (error: Error) => {
            console.error(
              "Erreur inattendue sur la connexion WebSocket du restaurant :",
              error,
            );
            if (authSocket) {
              unregisterRestaurantConnection(
                authSocket.restaurantId,
                authSocket,
              );
            }
          });
        } catch (err: unknown) {
          // En cas d'erreur asynchrone qui remonterait jusqu'ici
          socket.close(1008, "Token invalide");
        }
      } catch (error: unknown) {
        // En cas d'erreur générale, logger l'erreur et fermer avec code 1011 "Erreur serveur"
        console.error("Erreur générale WebSocket:", error);
        socket.close(1011, "Erreur serveur");
      }
    },
  );
};
