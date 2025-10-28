<!-- Page de listing des commandes d'un utilisateur
 Fonctionnalités : 
 - listing des commandes passés par le compte utilisateur  -->
<script setup lang="ts">
definePageMeta({
  layout: "user",
  middleware: ["auth-user"],
});
import { ref, computed } from "vue";
import { usePanierStore } from "~/stores/panier/panier";

const panierStore = usePanierStore();
const expandedOrderId = ref<number | null>(null);

// Trier les commandes par date décroissante (plus récent au plus ancien)
const commandesTriees = computed(() => {
  return [...panierStore.commandes].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
});

// Afficher/masquer les détails d'une commande
const toggleOrderDetails = (orderId: number) => {
  expandedOrderId.value = expandedOrderId.value === orderId ? null : orderId;
};
</script>

<template>
  <div class="commandes-historique">
    <h1>Historique des commandes</h1>

    <!-- Si aucune commande -->
    <div v-if="!panierStore.commandes.length" class="no-commandes">
      <p>Vous n'avez pas encore passé de commande</p>
      <NuxtLink to="/restaurants" class="btn">
        Découvrir nos restaurants
      </NuxtLink>
    </div>

    <!-- Liste des commandes -->
    <div v-else class="commandes-list">
      <OrderItem
        v-for="commande in commandesTriees"
        :key="commande.id"
        :id="commande.id"
        :clientName="'Moi'"
        :total="commande.total"
        :date="commande.date"
        @toggle-details="toggleOrderDetails"
      />

      <!-- Détails de la commande -->
      <div v-if="expandedOrderId" class="order-details">
        <div class="items-grid">
          <CartItem
            v-for="item in commandesTriees.find((c) => c.id === expandedOrderId)
              ?.items"
            :key="item.plat.id"
            :plat="item.plat"
            :quantite="item.quantite"
            :isEditable="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.commandes-historique {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.no-commandes {
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.no-commandes p {
  margin-bottom: 1.5rem;
  color: #666;
  font-size: 1.1rem;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  background-color: #4a90e2;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #357abd;
}

.commandes-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

/* Responsive design */
@media (max-width: 600px) {
  .commandes-historique {
    padding: 10px;
  }
}
</style>
