import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { usePanierStore } from "../../app/stores/panier/panier";
import type { Plat } from "../../app/types/plat";

describe("PanierStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("devrait calculer le total des articles et le prix total après l'ajout de 2 produits", () => {
    const store = usePanierStore();

    // Définit deux plats d'exemple du même restaurant
    const plat1: Plat = {
      id: 101,
      restaurantId: 1,
      nom: "Pizza Margherita",
      description: "Pizza classique à la tomate et mozzarella",
      prix: 10,
      imageUrl: "/images/plats/pizza-margherita.jpg",
    };

    const plat2: Plat = {
      id: 102,
      restaurantId: 1,
      nom: "Sushi",
      description: "Suhsi frais au saumon",
      prix: 15,
      imageUrl: "/images/plats/sushi.jpg",
    };

    // Ajoute les deux produits
    const res1 = store.addPlat(plat1);
    expect(res1.success).toBe(true);

    const res2 = store.addPlat(plat2);
    expect(res2.success).toBe(true);

    // Vérifie les totaux
    expect(store.totalItems).toBe(2);
    expect(store.totalPrix).toBe(25);
  });
});
