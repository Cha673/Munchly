<!-- Page de listing des commandes d'un utilisateur
 Fonctionnalités : 
 - listing des commandes passés par le compte utilisateur  -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { usePanierStore } from "~/stores/panier/panier";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const { $localePath } = useNuxtApp();

definePageMeta({
  layout: "user",
  middleware: ["auth-user"],
});

useHead({
  title: t("meta.command_user_title"),
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    {
      name: "description",
      content: t("meta.command_user_description"),
    },
  ],
});

useSeoMeta({
  title: t("meta.command_user_title"),
  ogTitle: t("meta.command_user_title"),
  description: t("meta.command_user_description"),
  ogDescription: t("meta.command_user_description"),
  ogImage: "/images/commandes.jpg",
  twitterCard: "summary_large_image",
});

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
    <h1>{{ t("users.historique_commandes") }}</h1>

    <!-- Si aucune commande -->
    <div v-if="!panierStore.commandes.length" class="no-commandes">
      <p>{{ t("users.no_command") }}</p>
      <NuxtLink :to="$localePath('/restaurants')" class="btn">
        {{ t("users.list_resto") }}
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem;
  background-color: #f9fafb;
  min-height: calc(100vh - 80px);
}

h1 {
  font-size: 2.5rem;
  color: #374151;
  font-weight: 600;
  margin-bottom: 3rem;
  position: relative;
}

h1::after {
  content: "";
  position: absolute;
  bottom: -0.75rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #4b5563;
  border-radius: 2px;
}

.no-commandes {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.no-commandes p {
  margin-bottom: 2rem;
  color: #4b5563;
  font-size: 1.1rem;
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

.commandes-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-details {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-width: 800px;
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

@media (max-width: 768px) {
  .commandes-historique {
    padding: 1.5rem 1rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 2.5rem;
  }

  .no-commandes {
    padding: 2rem 1rem;
  }

  .order-details {
    padding: 1.5rem;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }
}
</style>
