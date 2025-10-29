<!-- Dashboard du restaurateur
 Fonctionnalités : 
 mène vers les différents pages de gestion des plats, commandes et compte du restaurateur -->
<script setup lang="ts">
import { useUserStore } from "~/stores/users/user";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

definePageMeta({
  layout: "restaurateur",
  middleware: ["auth-restaurateur"],
});
useHead({
  title: t("meta.homeresto_title"),
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});
const userStore = useUserStore();
const user = computed(() => userStore.currentUser);
</script>

<template>
  <div class="dashboard-container">
    <div class="welcome-section">
      <h1>{{ t("meta.home_title") }}, {{ user?.name }}</h1>
      <p>{{ t("meta.orders_restaurateur_description") }}</p>
    </div>

    <div class="quick-actions">
      <div class="action-card" @click="navigateTo('/restaurateur/plats')">
        <h3>{{ t("header_plats") }}</h3>
        <p>{{ t("restaurants.control_dish") }}</p>
      </div>

      <div class="action-card" @click="navigateTo('/restaurateur/commandes')">
        <h3>{{ t("header_restaurateur_orders") }}</h3>
        <p>{{ t("header_user_orders_current") }}</p>
      </div>

      <div
        class="action-card"
        @click="navigateTo('/restaurateur/mon-restaurant')"
      >
        <h3>{{ t("header_restaurateur_dashboard") }}</h3>
        <p>{{ t("update_informations") }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 2rem;
}

.welcome-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.welcome-section h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.welcome-section p {
  color: #666;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.action-card h3 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.action-card p {
  color: #666;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .welcome-section {
    padding: 1.5rem;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
