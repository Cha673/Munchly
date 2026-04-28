import type { PrismaClient } from "../generated/prisma/client.js";
import { ForbiddenError, NotFoundError, ConflictError } from "../common/exceptions.js";
import type {
  CreateOrderRequest,
  UpdateOrderStatusRequest,
} from "../schemas/orders.schema.js";

export default class OrdersService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 1. Créer une commande (USER)
  createOrder = async (clientId: string, input: CreateOrderRequest) => {
    // a. Récupérer tous les plats demandés
    const platIds = input.items.map((item) => item.platId);
    const platsDB = await this.prisma.plat.findMany({
      where: { id: { in: platIds } },
    });

    if (platsDB.length !== platIds.length) {
      throw new NotFoundError("Certains plats n'existent pas");
    }

    // b. Vérifier que tous les plats appartiennent bien au restaurant spécifié
    const invalidPlats = platsDB.filter(
      (plat) => plat.restaurantId !== input.restaurantId
    );
    if (invalidPlats.length > 0) {
      throw new ConflictError("Tous les plats doivent provenir du même restaurant");
    }

    // c. Calculer le total
    let total = 0;
    const orderItemsData = input.items.map((item) => {
      const plat = platsDB.find((p) => p.id === item.platId)!;
      total += plat.prix * item.quantite;
      return {
        platId: plat.id,
        quantite: item.quantite,
        prixUnitaire: plat.prix,
      };
    });

    // d. Créer la commande et ses items en une transaction
    return await this.prisma.order.create({
      data: {
        clientId,
        restaurantId: input.restaurantId,
        total,
        status: "PENDING",
        items: {
          create: orderItemsData,
        },
      },
      include: { items: true },
    });
  };

  // 2. Récupérer une commande avec ses articles (USER ou RESTAURANT)
  getOrderById = async (orderId: string, userId: string, role: string) => {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { plat: true } }, restaurant: true },
    });

    if (!order) throw new NotFoundError("Commande non trouvée");

    // Autorisation : soit c'est MA commande (User), soit c'est MON restaurant (Restaurateur)
    if (role === "USER" && order.clientId !== userId) {
      throw new ForbiddenError("Cette commande ne vous appartient pas");
    }
    if (role === "RESTAURANT" && order.restaurant.ownerId !== userId) {
      throw new ForbiddenError("Cette commande n'est pas pour votre restaurant");
    }

    return order;
  };

  // 3. Lister les commandes d'un utilisateur (USER)
  getUserOrders = async (clientId: string) => {
    return await this.prisma.order.findMany({
      where: { clientId },
      include: { items: true, restaurant: true },
      orderBy: { createdAt: "desc" },
    });
  };

  // 4. Lister les commandes de SON restaurant (RESTAURANT)
  getRestaurantOrders = async (ownerId: string) => {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { ownerId },
    });

    if (!restaurant) {
      throw new NotFoundError("Vous n'avez pas de restaurant");
    }

    return await this.prisma.order.findMany({
      where: { restaurantId: restaurant.id },
      include: { items: { include: { plat: true } }, client: { select: { id: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  };

  // 5. Changer le statut de la commande (RESTAURANT)
  updateOrderStatus = async (
    orderId: string,
    ownerId: string,
    newStatus: UpdateOrderStatusRequest["status"]
  ) => {
    // Vérifier l'ownership via getOrderById (réutilisation de la sécurité !)
    await this.getOrderById(orderId, ownerId, "RESTAURANT");

    return await this.prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
  };

  // 6. Annuler une commande (seulement en PENDING) (USER)
  cancelOrder = async (orderId: string, clientId: string) => {
    const order = await this.getOrderById(orderId, clientId, "USER");

    if (order.status !== "PENDING") {
      throw new ConflictError("Impossible d'annuler une commande déjà en cours de préparation/livraison");
    }

    // Suppression de la commande (ou on pourrait avoir un statut CANCELLED, mais supprimons directement)
    await this.prisma.order.delete({
      where: { id: orderId },
    });

    return { message: "Commande annulée avec succès" };
  };
}
