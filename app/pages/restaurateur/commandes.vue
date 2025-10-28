<!-- page d'un restaurateur pour voir l'ensemble des ocmmandes faites pour des 
 plats de son restauran
 Fonctionnalités : 
 - listing des commandes
 - affichage des détails des commandes -->
<script setup lang="ts">
definePageMeta({
  layout: "restaurateur",
  middleware: ["auth-restaurateur"],
});

import { ref, computed } from "vue";
import { useUserStore } from "~/stores/users/user";
import { usePanierStore } from "~/stores/panier/panier";
import type { Order } from "~/types/orders/orders";
import OrderItem from "~/components/OrderItem.vue";
import CartItem from "~/components/CartItem.vue";

const userStore = useUserStore();
const panierStore = usePanierStore();
const currentUser = computed(() => userStore.currentUser);

const expandedOrderId = ref<number | null>(null);

// Récupérer les commandes du store qui correspondent à ce restaurateur
const orders = computed(() => {
  if (!currentUser.value) {
    return [];
  }

  const commandesFiltrees = panierStore.commandes.filter((commande) => {
    return commande.restaurantId === currentUser.value!.id;
  });

  console.log("Commandes filtrées:", commandesFiltrees);
  return commandesFiltrees;
});

// Afficher/masquer les détails d'une commande
const toggleOrderDetails = (orderId: number) => {
  expandedOrderId.value = expandedOrderId.value === orderId ? null : orderId;
};
</script>

<template>
  <div class="commandes-container">
    <div class="header">
      <h1>Mes Commandes</h1>
    </div>

    <!-- Liste des commandes -->
    <div class="orders-list">
      <OrderItem
        v-for="order in orders"
        :key="order.id"
        :id="order.id"
        :clientName="order.clientName || ''"
        :total="order.total"
        :date="new Date(order.date).toLocaleString()"
        @toggle-details="toggleOrderDetails"
      />

      <!-- Détails de la commande -->
      <div v-if="expandedOrderId" class="order-details">
        <h3>Détails de la commande #{{ expandedOrderId }}</h3>
        <div class="items-grid">
          <CartItem
            v-for="item in orders.find((o) => o.id === expandedOrderId)
              ?.items || []"
            :key="item.id"
            :plat="item.plat"
            :quantite="item.quantite"
            :isEditable="false"
          />
        </div>
      </div>

      <div v-if="!orders.length" class="no-orders">
        Aucune commande disponible
      </div>
    </div>
  </div>
</template>

<style scoped>
.commandes-container {
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  color: #333;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-details {
  background: #f5f5f5;
  padding: 1.5rem;
  margin: -0.5rem 0 1rem;
  border-radius: 0 0 8px 8px;
}

.order-details h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.no-orders {
  text-align: center;
  padding: 2rem;
  color: #666;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>
