<script setup lang="ts">
import { useUserStore } from "~/stores/users/user";

definePageMeta({
  layout: "restaurateur",
  middleware: ["auth-restaurateur"],
});

const userStore = useUserStore();
const user = computed(() => userStore.currentUser);
</script>

<template>
  <div class="dashboard-container">
    <div class="welcome-section">
      <h1>Bienvenue, {{ user?.name }}</h1>
      <p>Gérez votre restaurant depuis votre tableau de bord</p>
    </div>

    <div class="quick-actions">
      <div class="action-card" @click="navigateTo('/restaurateur/plats')">
        <h3>Mes Plats</h3>
        <p>Gérer vos plats</p>
      </div>

      <div class="action-card" @click="navigateTo('/restaurateur/commandes')">
        <h3>Commandes</h3>
        <p>Voir les commandes en cours</p>
      </div>

      <div
        class="action-card"
        @click="navigateTo('/restaurateur/mon-restaurant')"
      >
        <h3>Mon Restaurant</h3>
        <p>Modifier les informations</p>
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
