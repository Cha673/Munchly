import type { FastifyInstance } from "fastify";
import PlatsService from "../../services/plats.service.js";
import {
  CreatePlatSchema,
  UpdatePlatSchema,
  type CreatePlatRequest,
  type UpdatePlatRequest,
} from "../../schemas/plats.schema.js";

export const platsRoutes = async (app: FastifyInstance) => {
  const platsService = new PlatsService(app.prisma);

  // 1. Créer un plat (RESTAURANT)
  // Résout implicitement le restaurant ciblé grâce au ownerId du JWT
  app.post<{ Body: CreatePlatRequest }>(
    "/",
    {
      schema: { body: CreatePlatSchema },
      preValidation: [app.authenticate, app.authorize(["RESTAURANT"])],
    },
    async (request, reply) => {
      const plat = await platsService.createPlat(request.user.id, request.body);
      reply.status(201).send(plat);
    },
  );

  // 2. Récupérer les plats d'un restaurant particulier (Public)
  app.get<{ Params: { restaurantId: string } }>(
    "/restaurant/:restaurantId",
    async (request, reply) => {
      return await platsService.getPlatsByRestaurant(request.params.restaurantId);
    },
  );

  // 3. Détails d'un plat (Public)
  app.get<{ Params: { id: string } }>(
    "/:id",
    async (request, reply) => {
      return await platsService.getPlatById(request.params.id);
    },
  );

  // 4. Modifier un plat (RESTAURANT : propriétaire seulement)
  app.patch<{ Params: { id: string }; Body: UpdatePlatRequest }>(
    "/:id",
    {
      schema: { body: UpdatePlatSchema },
      preValidation: [app.authenticate, app.authorize(["RESTAURANT"])],
    },
    async (request, reply) => {
      return await platsService.updatePlat(
        request.params.id,
        request.user.id,
        request.body,
      );
    },
  );

  // 5. Supprimer un plat (RESTAURANT : propriétaire seulement)
  app.delete<{ Params: { id: string } }>(
    "/:id",
    {
      preValidation: [app.authenticate, app.authorize(["RESTAURANT"])],
    },
    async (request, reply) => {
      const result = await platsService.deletePlat(request.params.id, request.user.id);
      return reply.status(200).send(result);
    },
  );
};
