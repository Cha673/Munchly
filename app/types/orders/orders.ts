import type { Plat } from "../plats/plats";

export interface OrderItem {
  id: number;
  platId: number;
  plat: Plat;
  quantite: number;
}

export interface Order {
  id: number;
  restaurantId: number;
  clientId: number;
  clientName: string;
  items: OrderItem[];
  total: number;
  date: string;
}
