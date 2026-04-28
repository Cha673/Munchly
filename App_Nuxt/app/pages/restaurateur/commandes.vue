<!-- page d'un restaurateur pour voir l'ensemble des ocmmandes faites pour des 
 plats de son restauran
 Fonctionnalités : 
 - listing des commandes
 - affichage des détails des commandes -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "~/stores/users/user";
import { usePanierStore } from "~/stores/panier/panier";
import OrderItem from "~/components/OrderItem.vue";
import CartItem from "~/components/CartItem.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

definePageMeta({
  layout: "restaurateur",
  middleware: ["auth-restaurateur"],
});

useHead({
  title: t("orders.restaurateur_title"),
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    {
      name: "description",
      content: t("orders.restaurateur_description"),
    },
  ],
});

useSeoMeta({
  title: t("orders.restaurateur_title"),
  ogTitle: t("orders.restaurateur_title"),
  description: t("orders.restaurateur_description"),
  ogDescription: t("orders.restaurateur_description"),
  ogImage: "/images/commandes-resto.jpg",
  twitterCard: "summary_large_image",
});

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
      <h1>{{ t("orders.my_orders") }}</h1>
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
        <h3>{{ t("orders.order_details") }} #{{ expandedOrderId }}</h3>
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
        {{ t("orders.no_orders") }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.commandes-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem;
  background-color: #f9fafb;
  min-height: calc(100vh - 80px);
}

.header {
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  color: #374151;
  font-weight: 600;
  position: relative;
  margin: 0;
}

.header h1::after {
  content: "";
  position: absolute;
  bottom: -0.75rem;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: #4b5563;
  border-radius: 2px;
}

.error-message {
  background-color: #fef2f2;
  color: #ef4444;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid #fee2e2;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #4b5563;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-details {
  background: white;
  padding: 2rem;
  margin: -0.5rem 0 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.order-details h3 {
  font-size: 1.5rem;
  color: #374151;
  font-weight: 600;
  margin: 0 0 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
  text-align: center;
}

.items-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.no-orders {
  text-align: center;
  padding: 3rem;
  color: #4b5563;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .commandes-container {
    padding: 1.5rem 1rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .order-details {
    padding: 1.5rem;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }
}
</style>
