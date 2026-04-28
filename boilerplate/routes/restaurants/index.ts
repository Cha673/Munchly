import type { FastifyInstance } from "fastify";
import RestaurantService from "../../services/restaurants.service.js";
import {
  CreateRestaurantSchema,
  UpdateRestaurantSchema,
  type CreateRestaurantRequest,
  type UpdateRestaurantRequest,
} from "../../schemas/restaurant.schema.js";

export const restaurantsRoutes = async (app: FastifyInstance) => {
  const restaurantService = new RestaurantService(app.prisma);

  app.get("/", async (request, reply) => {
    const restaurants = await restaurantService.getAllRestaurants();
    return restaurants;
  });

  // ADMIN seulement
  app.post<{ Body: CreateRestaurantRequest }>(
    "/",
    {
      schema: {
        body: CreateRestaurantSchema,
      },
      preValidation: [app.authenticate, app.authorize(["ADMIN"])],
    },
    async (request, reply) => {
      const restaurant = await restaurantService.createRestaurant(request.body);
      reply.status(201).send(restaurant);
    },
  );

  // RESTAURANT authentifié
  app.get(
    "/me",
    {
      preValidation: [app.authenticate, app.authorize(["RESTAURANT"])],
    },
    async (request, reply) => {
      const myRestaurant = await restaurantService.getMyRestaurant(
        request.user.id,
      );
      if (!myRestaurant) {
        return reply
          .status(404)
          .send({ message: "Vous n'avez pas de restaurant" });
      }
      return myRestaurant;
    },
  );

  // RESTAURANT vérifie que seul le proprio s'auto-modifie via /me
  app.patch<{ Body: UpdateRestaurantRequest }>(
    "/me",
    {
      schema: {
        body: UpdateRestaurantSchema,
      },
      preValidation: [app.authenticate, app.authorize(["RESTAURANT"])],
    },
    async (request, reply) => {
      const updated = await restaurantService.updateMyRestaurant(
        request.user.id,
        request.body,
      );
      return updated;
    },
  );
};
