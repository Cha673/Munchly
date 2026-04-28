import type { IResolvers } from "mercurius";
import type { FastifyInstance } from "fastify";
import { NotFoundError } from "../common/exceptions.js";

export const createRestaurantResolvers = (
  app: FastifyInstance,
): IResolvers => ({
  Query: {
    // 1. Récupérer TOUS les restaurants
    restaurants: async () => {
      // On retourne tous les restaurants depuis Prisma
      return await app.prisma.restaurant.findMany();
    },
    // 2. Récupérer un restaurant précis par son ID
    restaurant: async (_, args) => {
      const restaurant = await app.prisma.restaurant.findUnique({
        where: { id: args.id },
      });
      if (!restaurant) {
        throw new NotFoundError("Restaurant non trouvé");
      }
      return restaurant;
    },
  },

  Restaurant: {
    // 3. (Field Resolver) : Fait le pont entre "Restaurant.dishes" (GraphQL) et "Plat" (Prisma)
    // Il ne se déclenchera QUE si l'application cliente demande explicitement ce champ !
    dishes: async (parent) => {
      return await app.prisma.plat.findMany({
        where: { restaurantId: parent.id },
      });
    },
  },
});
