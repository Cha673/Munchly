import type { PrismaClient } from "../generated/prisma/client.js";
import {
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from "../common/exceptions.js";
import { hash } from "bcryptjs";
import type {
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
} from "../schemas/restaurant.schema.js";

export default class RestaurantService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  getAllRestaurants = async () => {
    return await this.prisma.restaurant.findMany({});
  };

  createRestaurant = async (input: CreateRestaurantRequest) => {
    // Vérifier si le futur propriétaire existe et a le rôle RESTAURANT
    const user = await this.prisma.user.findUnique({
      where: { id: input.ownerId },
    });

    if (!user || user.role !== "RESTAURANT") {
      throw new ConflictError(
        "L'utilisateur spécifié n'existe pas ou n'est pas un restaurateur",
      );
    }

    return await this.prisma.restaurant.create({
      data: {
        nom: input.nom,
        lieu: input.lieu,
        description: input.description,
        imageUrl: input.imageUrl || "https://placehold.co/600x400/png",
        ownerId: input.ownerId,
      },
    });
  };

  getMyRestaurant = async (ownerId: string) => {
    return await this.prisma.restaurant.findFirst({
      where: {
        ownerId: ownerId,
      },
    });
  };

  updateMyRestaurant = async (
    ownerId: string,
    input: UpdateRestaurantRequest,
  ) => {
    const restaurant = await this.getMyRestaurant(ownerId);
    if (!restaurant) {
      throw new NotFoundError("Vous ne possédez aucun restaurant");
    }

    return await this.prisma.restaurant.update({
      where: { id: restaurant.id },
      data: input,
    });
  };
}
