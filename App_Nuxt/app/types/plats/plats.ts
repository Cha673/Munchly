// Définitions des types pour les plats
export type Plat = {
  id: number;
  restaurantId: number; // pour relier le plat à un restaurant
  nom: string;
  description: string;
  prix: number;
  imageUrl: string;
};
