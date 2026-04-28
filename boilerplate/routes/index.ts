import type { FastifyInstance } from "fastify";
import { authRoutes } from "./auth/index.js";
import { restaurantsRoutes } from "./restaurants/index.js";
import { platsRoutes } from "./plats/index.js";
import { ordersRoutes } from "./orders/index.js";
import { usersRoutes } from "./users/index.js";
import { websocketRoutes } from "./websocket.js";

export const registerRoutes = async (app: FastifyInstance) => {
  // Routes WebSocket
  await app.register(websocketRoutes);

  // Routes API
  await app.register(
    async (fastify) => {
      await fastify.register(authRoutes, { prefix: "/auth" });
      await fastify.register(restaurantsRoutes, { prefix: "/restaurants" });
      await fastify.register(platsRoutes, { prefix: "/plats" });
      await fastify.register(ordersRoutes, { prefix: "/orders" });
      await fastify.register(usersRoutes, { prefix: "/users" });
    },
    { prefix: "/api" },
  );
};
