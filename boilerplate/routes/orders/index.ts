import type { FastifyInstance } from "fastify";
import OrdersService from "../../services/orders.service.js";
import { notifyRestaurant } from "../../services/websocket.service.js";
import {
  CreateOrderSchema,
  UpdateOrderStatusSchema,
  type CreateOrderRequest,
  type UpdateOrderStatusRequest,
} from "../../schemas/orders.schema.js";

export const ordersRoutes = async (app: FastifyInstance) => {
  const ordersService = new OrdersService(app.prisma);

  // 1. Créer une commande (USER)
  app.post<{ Body: CreateOrderRequest }>(
    "/",
    {
      schema: { body: CreateOrderSchema },
      preValidation: [app.authenticate, app.authorize(["USER"])],
    },
    async (request, reply) => {
      const order = await ordersService.createOrder(
        request.user.id,
        request.body,
      );

      // Notification au restaurant en temps réel (via WebSocket)
      notifyRestaurant(order.restaurantId, "new-order", {
        orderId: order.id,
        totalPrice: order.total,
        itemCount: order.items.length,
        createdAt: order.createdAt,
      });

      reply.status(201).send(order);
    },
  );

  // 2. Lister SES propres commandes de client (USER)
  app.get(
    "/my-orders",
    {
      preValidation: [app.authenticate, app.authorize(["USER"])],
    },
    async (request, reply) => {
      return await ordersService.getUserOrders(request.user.id);
    },
  );

  // 3. Lister les commandes reçues par SON restaurant (RESTAURANT)
  app.get(
    "/restaurant",
    {
      preValidation: [app.authenticate, app.authorize(["RESTAURANT"])],
    },
    async (request, reply) => {
      return await ordersService.getRestaurantOrders(request.user.id);
    },
  );

  // 4. Récupérer une commande spécifique (USER ou RESTAURANT)
  app.get<{ Params: { id: string } }>(
    "/:id",
    {
      preValidation: [app.authenticate],
    },
    async (request, reply) => {
      // La sécurité (qui peut voir quoi) est gérée à l'intérieur du service
      return await ordersService.getOrderById(
        request.params.id,
        request.user.id,
        request.user.role,
      );
    },
  );

  // 5. Changer le statut d'une commande (RESTAURANT)
  app.patch<{ Params: { id: string }; Body: UpdateOrderStatusRequest }>(
    "/:id/status",
    {
      schema: { body: UpdateOrderStatusSchema },
      preValidation: [app.authenticate, app.authorize(["RESTAURANT"])],
    },
    async (request, reply) => {
      return await ordersService.updateOrderStatus(
        request.params.id,
        request.user.id,
        request.body.status,
      );
    },
  );

  // 6. Annuler une commande (USER) - Uniquement si PENDING
  app.delete<{ Params: { id: string } }>(
    "/:id",
    {
      preValidation: [app.authenticate, app.authorize(["USER"])],
    },
    async (request, reply) => {
      const result = await ordersService.cancelOrder(
        request.params.id,
        request.user.id,
      );
      return reply.status(200).send(result);
    },
  );
};
