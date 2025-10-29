<!-- Page panier de l'utilisateur 
 Fonctionnalités : 
 - liste les plats compris dans le panier
 - permet de modifier les quantités des plats
 - calcul le total des plats dans le panier
 - permet de valider le panier et de le passer en tant que commande
 - accéder à la liste des commandes avec un bouton -->
<script setup lang="ts">
useHead({
  title: "Mon panier - Munchly",
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    {
      name: "description",
      content:
        "Consultez votre panier, modifiez les quantités et validez votre commande en quelques clics.",
    },
  ],
});

useSeoMeta({
  title: "Mon panier - Munchly",
  ogTitle: "Mon panier - Munchly",
  description:
    "Consultez votre panier, modifiez les quantités et validez votre commande en quelques clics.",
  ogDescription:
    "Consultez votre panier, modifiez les quantités et validez votre commande en quelques clics.",
  ogImage: "/images/panier.jpg",
  twitterCard: "summary_large_image",
});

definePageMeta({
  layout: "user",
  middleware: ["auth-user"],
});

import { usePanierStore } from "~/stores/panier/panier";

const panierStore = usePanierStore();

const validerCommande = () => {
  const commande = panierStore.validerCommande();
};
</script>

<template>
  <div class="panier-page">
    <h1>Mon Panier</h1>

    <div v-if="panierStore.isPanierVide" class="panier-vide">
      <p>Votre panier est vide</p>
      <NuxtLink to="/restaurants" class="btn"
        >Découvrir nos restaurants</NuxtLink
      >
    </div>

    <div v-else>
      <div class="panier-items">
        <CartItem
          v-for="item in panierStore.items"
          :key="item.plat.id"
          :plat="item.plat"
          :quantite="item.quantite"
        />
      </div>

      <div class="panier-footer">
        <div class="total">
          <span>Total :</span>
          <span class="total-prix"
            >{{ panierStore.totalPrix.toFixed(2) }} €</span
          >
        </div>

        <div class="actions">
          <button @click="panierStore.clearPanier()" class="btn-clear">
            Vider le panier
          </button>
          <button @click="validerCommande" class="btn-valider">
            Valider la commande
          </button>
        </div>
      </div>
    </div>

    <div class="historique-section">
      <NuxtLink to="/user/commandes" class="btn-historique">
        Voir l'historique de mes commandes
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.panier-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  background-color: #f9fafb;
  min-height: calc(100vh - 80px);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2.5rem;
  color: #374151;
  font-weight: 600;
  position: relative;
}

h1::after {
  content: "";
  position: absolute;
  bottom: -0.75rem;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: #4b5563;
  border-radius: 2px;
}

.panier-vide {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.panier-vide p {
  font-size: 1.2rem;
  color: #4b5563;
  margin-bottom: 2rem;
}

.btn {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #4b5563;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  background-color: #374151;
  transform: translateY(-1px);
}

.panier-items {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.panier-footer {
  margin-top: 2rem;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  color: #374151;
}

.total-prix {
  font-weight: 600;
  color: #4b5563;
  font-size: 2rem;
}

.actions {
  display: flex;
  gap: 1.5rem;
}

.btn-clear {
  flex: 1;
  padding: 1rem 2rem;
  background: white;
  color: #ef4444;
  border: 2px solid #ef4444;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-1px);
}

.btn-valider {
  flex: 2;
  padding: 1rem 2rem;
  background: #4b5563;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-valider:hover {
  background: #374151;
  transform: translateY(-1px);
}

.historique-section {
  margin-top: 3rem;
  text-align: center;
}

.btn-historique {
  display: inline-block;
  padding: 1rem 2rem;
  background: white;
  color: #4b5563;
  text-decoration: none;
  border: 2px solid #4b5563;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-historique:hover {
  background: #4b5563;
  color: white;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .panier-page {
    padding: 1.5rem 1rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .panier-items,
  .panier-footer {
    padding: 1.5rem;
  }

  .total {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .total-prix {
    font-size: 1.75rem;
  }

  .actions {
    flex-direction: column;
  }

  .btn-clear,
  .btn-valider {
    width: 100%;
  }

  .historique-section {
    margin-top: 2rem;
  }

  .btn-historique {
    width: auto;
    text-align: center;
  }
}
</style>
