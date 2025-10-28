import { defineStore } from "pinia";
import type { Plat } from "~/types/plats/plats";
import type { ItemPanier, Commande } from "~/types/panier/panier";
import { useUserStore } from "~/stores/users/user";

// Récupérer les commandes du localStorage s'il y en a
const commandesStockees = process.client
  ? JSON.parse(localStorage.getItem("commandes") || "[]")
  : [];

export const usePanierStore = defineStore("panier", {
  state: () => ({
    items: [] as ItemPanier[],
    commandes: commandesStockees as Commande[],
  }),

  getters: {
    // Nombre total d'articles dans le panier
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantite, 0);
    },

    // Prix total du panier
    totalPrix: (state) => {
      return state.items.reduce(
        (total, item) => total + item.plat.prix * item.quantite,
        0
      );
    },

    // Vérifier si le panier est vide
    isPanierVide: (state) => {
      return state.items.length === 0;
    },

    // Nombre total de commandes
    totalCommandes: (state) => {
      return state.commandes.length;
    },
  },

  actions: {
    // Ajouter un plat au panier
    addPlat(plat: Plat) {
      // Vérifier si le panier est vide
      if (this.items.length === 0) {
        // Si le panier est vide, ajouter le plat
        this.items.push({
          plat,
          quantite: 1,
        });
        return { success: true };
      }

      // Vérifier si le nouveau plat vient du même restaurant
      const firstItem = this.items[0];
      if (!firstItem) return { success: true };

      const currentRestaurantId = firstItem.plat.restaurantId;
      if (plat.restaurantId !== currentRestaurantId) {
        // Si le plat vient d'un autre restaurant, retourner une erreur
        return {
          success: false,
          error: "different_restaurant",
          message:
            "Vous avez déjà des plats d'un autre restaurant dans votre panier.",
          currentRestaurantId: currentRestaurantId,
        };
      }

      // Si c'est le même restaurant, vérifier si le plat existe déjà
      const existingItem = this.items.find((item) => item.plat.id === plat.id);
      if (existingItem) {
        // Si le plat existe déjà, augmenter la quantité
        existingItem.quantite++;
      } else {
        // Sinon, ajouter un nouvel item
        this.items.push({
          plat,
          quantite: 1,
        });
      }

      return { success: true };
    },

    // Retirer un plat du panier
    removePlat(platId: number) {
      this.items = this.items.filter((item) => item.plat.id !== platId);
    },

    // Augmenter la quantité d'un plat
    incrementQuantite(platId: number) {
      const item = this.items.find((item) => item.plat.id === platId);
      if (item) {
        item.quantite++;
      }
    },

    // Diminuer la quantité d'un plat
    decrementQuantite(platId: number) {
      const item = this.items.find((item) => item.plat.id === platId);
      if (item) {
        if (item.quantite > 1) {
          item.quantite--;
        } else {
          // Si quantité = 1, retirer du panier
          this.removePlat(platId);
        }
      }
    },

    // Vider le panier
    clearPanier() {
      this.items = [];
    },

    // Valider le panier et créer une commande
    async validerCommande() {
      if (this.items.length === 0) return null;

      // Récupérer l'utilisateur connecté
      const userStore = useUserStore();
      if (!userStore.currentUser) return null;

      // Récupérer le restaurantId du premier plat
      const restaurantId = this.items[0]?.plat.restaurantId;
      if (!restaurantId) return null;

      // Convertir les items du panier en OrderItems
      const orderItems = this.items.map((item) => ({
        platId: item.plat.id,
        plat: item.plat,
        quantite: item.quantite,
      }));

      const nouvelleCommande = {
        restaurantId,
        clientId: userStore.currentUser.id,
        clientName: userStore.currentUser.name,
        items: orderItems,
        total: this.totalPrix,
        date: new Date().toISOString(),
      };

      try {
        // Ajouter un ID à la nouvelle commande (basé sur le nombre de commandes existantes)
        const nouvelId = this.commandes.length + 1;

        // Créer les items avec ID
        const itemsAvecId = orderItems.map((item, index) => ({
          ...item,
          id: nouvelId * 1000 + index, // Crée un ID unique pour chaque item
        }));

        const commandeAvecId = {
          id: nouvelId,
          items: itemsAvecId,
          restaurantId,
          clientId: userStore.currentUser.id,
          clientName: userStore.currentUser.name,
          total: this.totalPrix,
          date: new Date().toISOString(),
        };

        // Ajouter la commande à la liste des commandes
        this.commandes.push(commandeAvecId);

        // Sauvegarder dans le localStorage
        if (process.client) {
          localStorage.setItem("commandes", JSON.stringify(this.commandes));
        }

        // Vider le panier après une commande réussie
        this.clearPanier();

        return commandeAvecId;
      } catch (error) {
        console.error("Erreur lors de la création de la commande:", error);
        throw error;
      }
    },
  },
});
