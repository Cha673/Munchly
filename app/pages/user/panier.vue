<!-- Page panier de l'utilisateur 
 Fonctionnalités : 
 - liste les plats compris dans le panier
 - permet de modifier les quantités des plats
 - calcul le total des plats dans le panier
 - permet de valider le panier et de le passer en tant que commande
 - accéder à la liste des commandes avec un bouton -->
<script setup lang="ts">
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
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
}

.panier-vide {
  text-align: center;
  padding: 4rem 0;
}

.panier-vide p {
  font-size: 1.2rem;
  color: #999;
  margin-bottom: 2rem;
}

.btn {
  display: inline-block;
  padding: 1rem 2rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.1rem;
  transition: background 0.3s;
}

.btn:hover {
  background: #764ba2;
}

.panier-items {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.panier-item {
  display: grid;
  grid-template-columns: 2fr 150px 100px 40px;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid #eee;
}

.panier-item:last-child {
  border-bottom: none;
}

.item-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.item-prix {
  color: #666;
  margin: 0;
}

.item-quantite {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-qty {
  width: 32px;
  height: 32px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-qty:hover {
  background: #667eea;
  color: white;
}

.qty {
  font-size: 1.1rem;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

.item-total {
  font-size: 1.2rem;
  font-weight: bold;
  color: #27ae60;
  text-align: right;
}

.btn-remove {
  width: 32px;
  height: 32px;
  border: none;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.3s;
}

.btn-remove:hover {
  background: #c0392b;
}

.panier-footer {
  margin-top: 2rem;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
}

.total-prix {
  font-weight: bold;
  color: #27ae60;
  font-size: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn-clear {
  flex: 1;
  padding: 1rem 2rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-clear:hover {
  background: #c0392b;
}

.btn-valider {
  flex: 2;
  padding: 1rem 2rem;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-valider:hover {
  background: #229954;
}

@media (max-width: 768px) {
  .panier-item {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .item-quantite,
  .item-total {
    justify-self: start;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
