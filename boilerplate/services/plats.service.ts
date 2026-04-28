import type { PrismaClient, Plat } from "../generated/prisma/client.js";
import { ForbiddenError, NotFoundError } from "../common/exceptions.js";
import type { CreatePlatRequest, UpdatePlatRequest } from "../schemas/plats.schema.js";

export default class PlatsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Vérifier si le plat appartient bien au restaurant du restaurateur connecté
  private async checkPlatOwnership(platId: string, ownerId: string): Promise<Plat> {
    const plat = await this.prisma.plat.findUnique({
      where: { id: platId },
      include: { restaurant: true },
    });

    if (!plat) {
      throw new NotFoundError("Plat non trouvé");
    }

    if (plat.restaurant.ownerId !== ownerId) {
      throw new ForbiddenError("Ce plat appartient à un autre restaurant");
    }

    return plat;
  }

  // 1. Ajouter un plat au restaurant du user connecté
  createPlat = async (ownerId: string, input: CreatePlatRequest) => {
    // On trouve d'abord le restaurant du restaurateur connecté
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { ownerId },
    });

    if (!restaurant) {
      throw new NotFoundError("Vous ne possédez aucun restaurant pour y ajouter un plat");
    }

    return await this.prisma.plat.create({
      data: {
        nom: input.nom,
        description: input.description,
        prix: input.prix,
        imageUrl: input.imageUrl || "https://placehold.co/400x400/png",
        restaurantId: restaurant.id,
      },
    });
  };

  // 2. Lister les plats d'un resto (Public)
  getPlatsByRestaurant = async (restaurantId: string) => {
    return await this.prisma.plat.findMany({
      where: { restaurantId },
    });
  };

  // 3. Détails d'un plat (Public)
  getPlatById = async (platId: string) => {
    const plat = await this.prisma.plat.findUnique({
      where: { id: platId },
    });
    if (!plat) throw new NotFoundError("Plat non trouvé");
    return plat;
  };

  // 4. Modifier un plat (Vérification du propriétaire)
  updatePlat = async (platId: string, ownerId: string, input: UpdatePlatRequest) => {
    await this.checkPlatOwnership(platId, ownerId);

    return await this.prisma.plat.update({
      where: { id: platId },
      data: input,
    });
  };

  // 5. Supprimer un plat (Vérification du propriétaire)
  deletePlat = async (platId: string, ownerId: string) => {
    await this.checkPlatOwnership(platId, ownerId);

    await this.prisma.plat.delete({
      where: { id: platId },
    });

    return { message: "Plat supprimé avec succès" };
  };
}
