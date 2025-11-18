<!-- Affichage des informations d'une commande dans le listing des commandes
     pour les utilisateurs et pour les restaurateurs -->
<script setup lang="ts">
defineProps<{
  id: number;
  clientName: string;
  total: number;
  date: string;
}>();

const emit = defineEmits<{
  toggleDetails: [id: number];
}>();

const { t } = useI18n();
</script>

<template>
  <div class="order-item">
    <div class="order-header">
      <div class="order-info">
        <h3>{{ t("header_restaurateur_orders") }} #{{ id }}</h3>
        <p class="client-name">{{ t("common.client") }}: {{ clientName }}</p>
        <p class="order-date">{{ date }}</p>
      </div>
      <div class="order-actions">
        <span class="total">{{ total.toFixed(2) }}€</span>
        <button class="details-button" @click="emit('toggleDetails', id)">
          {{ t("orders.voir_plus") }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #4b5563;
  transition: all 0.3s ease;
}

.order-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.1),
    0 4px 6px -1px rgba(0, 0, 0, 0.06);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.order-info h3 {
  margin: 0 0 0.75rem;
  color: #374151;
  font-size: 1.25rem;
  font-weight: 600;
}

.client-name {
  margin: 0 0 0.5rem;
  color: #4b5563;
  font-size: 1rem;
  font-weight: 500;
}

.order-date {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.order-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.total {
  font-weight: 600;
  color: #4b5563;
  font-size: 1.25rem;
}

.details-button {
  background: white;
  border: 2px solid #4b5563;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  color: #4b5563;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.details-button:hover {
  background: #4b5563;
  color: white;
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .order-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .order-actions {
    width: 100%;
    flex-direction: column;
    gap: 1rem;
  }

  .details-button {
    width: 100%;
    text-align: center;
  }
}
</style>
