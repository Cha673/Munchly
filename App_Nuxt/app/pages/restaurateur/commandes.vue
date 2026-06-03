<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
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

const expandedOrderId = ref<string | number | null>(null);
const orders = ref<any[]>([]);
const loading = ref(false);

const fetchRestaurantOrders = async () => {
  loading.value = true;
  try {
    const api = useApi();
    const data: any = await api("/orders/restaurant");
    orders.value = data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
  }
  loading.value = false;
};

const advanceStatus = async (order: any) => {
  const statusTransitions: Record<string, string> = {
    PENDING: "CONFIRMED",
    CONFIRMED: "SHIPPED", // Aligné avec le service backend modifié
    SHIPPED: "DELIVERED",
  };

  // 1. On cherche la commande directement dans la liste fraîche de l'écran
  const freshOrder = orders.value.find((o) => o.id === order.id);

  // 2. Si on la trouve, on prend son vrai statut actuel, sinon on prend l'ancien
  const currentStatus = freshOrder ? freshOrder.status : order.status;

  // 3. On calcule le statut suivant basé sur le VRAI statut
  const nextStatus = statusTransitions[currentStatus];
  if (!nextStatus) return;

  try {
    const api = useApi();
    // Appel PATCH vers Fastify
    await api(`/orders/${order.id}/status`, {
      method: "PATCH",
      body: { status: nextStatus },
    });

    // 4. On rafraîchit l'écran
    await fetchRestaurantOrders();
  } catch (error) {
    console.error("Erreur lors du changement de statut:", error);
    alert("Impossible de changer le statut (Erreur de transition)");
  }
};

onMounted(() => {
  if (
    currentUser.value?.role === "RESTAURANT" ||
    currentUser.value?.role === "restaurateur"
  ) {
    fetchRestaurantOrders();
  }
});

const toggleOrderDetails = (orderId: string | number) => {
  expandedOrderId.value = expandedOrderId.value === orderId ? null : orderId;
};
</script>

<template>
  <div class="commandes-container">
    <div class="header">
      <h1>{{ t("orders.my_orders") }}</h1>
    </div>

    <div v-if="loading" class="loading">
      {{ t("orders.loading") || "Chargement..." }}
    </div>

    <div v-else class="orders-list">
      <OrderItem
        v-for="order in orders"
        :key="order.id"
        :id="order.id"
        :clientName="order.client?.email || `Client ${order.clientId}`"
        :total="order.total"
        :date="new Date(order.createdAt || order.date).toLocaleString()"
        @toggle-details="toggleOrderDetails"
      />

      <div v-if="expandedOrderId" class="order-details">
        <h3>{{ t("orders.order_details") }} #{{ expandedOrderId }}</h3>

        <div v-if="orders.find((o) => o.id === expandedOrderId)">
          <p
            style="
              text-align: center;
              font-weight: bold;
              margin-bottom: 1.5rem;
              font-size: 1.1rem;
            "
          >
            Statut actuel :
            <span
              style="
                color: #4f46e5;
                background: #e0e7ff;
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
              "
              >{{ orders.find((o) => o.id === expandedOrderId)?.status }}</span
            >
          </p>

          <div
            style="text-align: center; margin-bottom: 2rem"
            v-if="
              orders.find((o) => o.id === expandedOrderId)?.status !==
              'DELIVERED'
            "
          >
            <button
              @click="
                advanceStatus(orders.find((o) => o.id === expandedOrderId))
              "
              style="
                background-color: #10b981;
                color: white;
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: background 0.2s;
              "
              onmouseover="this.style.backgroundColor = '#059669'"
              onmouseout="this.style.backgroundColor = '#10b981'"
            >
              {{
                orders.find((o) => o.id === expandedOrderId)?.status ===
                "PENDING"
                  ? "Accepter la commande (CONFIRMED)"
                  : orders.find((o) => o.id === expandedOrderId)?.status ===
                      "CONFIRMED"
                    ? "Lancer la préparation (PREPARING)"
                    : orders.find((o) => o.id === expandedOrderId)?.status ===
                        "PREPARING"
                      ? "Expédier la commande (SHIPPED)"
                      : "Marquer comme Livrée (DELIVERED)"
              }}
            </button>
          </div>
        </div>

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
}
</style>
