import type { Plat } from "~/types/plats/plats";
import type { Order, OrderItem } from "~/types/orders/orders";

// Type local pour le panier
export type ItemPanier = {
  plat: Plat;
  quantite: number;
};

// Réutilisation du type Order avec quelques champs optionnels
export type Commande = Omit<
  Order,
  "restaurantId" | "clientId" | "clientName"
> & {
  restaurantId?: number;
  clientId?: number;
  clientName?: string;
};
