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
</script>

<template>
  <div class="order-item">
    <div class="order-header">
      <div class="order-info">
        <h3>Commande #{{ id }}</h3>
        <p class="client-name">Client: {{ clientName }}</p>
        <p class="order-date">{{ date }}</p>
      </div>
      <div class="order-actions">
        <span class="total">{{ total.toFixed(2) }}€</span>
        <button class="details-button" @click="emit('toggleDetails', id)">
          Voir détails
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #2196f3;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info h3 {
  margin: 0 0 0.5rem;
  color: #333;
}

.client-name {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.order-date {
  margin: 0;
  color: #999;
  font-size: 0.8rem;
}

.order-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.total {
  font-weight: bold;
  color: #333;
}

.details-button {
  background: #e0e0e0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  color: #333;
}

.details-button:hover {
  background: #d5d5d5;
}
</style>
