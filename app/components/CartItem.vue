<script setup lang="ts">
import { usePanierStore } from "~/stores/panier/panier";

interface Props {
  plat: {
    id: number;
    nom: string;
    prix: number;
  };
  quantite: number;
  isEditable?: boolean; // Pour différencier l'affichage panier vs commandes
}

const props = withDefaults(defineProps<Props>(), {
  isEditable: true,
});

const panierStore = usePanierStore();
</script>

<template>
  <div class="panier-item">
    <div class="item-info">
      <h3>{{ plat.nom }}</h3>
      <p class="item-prix">{{ plat.prix }} €</p>
    </div>

    <div v-if="isEditable" class="item-quantite">
      <button @click="panierStore.decrementQuantite(plat.id)" class="btn-qty">
        -
      </button>
      <span class="qty">{{ quantite }}</span>
      <button @click="panierStore.incrementQuantite(plat.id)" class="btn-qty">
        +
      </button>
    </div>
    <div v-else class="item-quantite">
      <span class="qty">Quantité: {{ quantite }}</span>
    </div>

    <div class="item-total">{{ (plat.prix * quantite).toFixed(2) }} €</div>

    <button
      v-if="isEditable"
      @click="panierStore.removePlat(plat.id)"
      class="btn-remove"
    >
      ✕
    </button>
  </div>
</template>

<style scoped>
.panier-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.item-info {
  flex: 2;
}

.item-info h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.item-prix {
  margin: 0.25rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

.item-quantite {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 1rem;
}

.btn-qty {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: #333;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-qty:hover {
  background: #f5f5f5;
}

.qty {
  min-width: 30px;
  text-align: center;
  font-weight: 500;
}

.item-total {
  font-weight: bold;
  color: #4a90e2;
  margin: 0 1rem;
}

.btn-remove {
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  color: #ff4444;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-remove:hover {
  color: #cc0000;
}

@media (max-width: 600px) {
  .panier-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .item-info,
  .item-quantite,
  .item-total {
    margin: 0;
  }

  .btn-remove {
    margin-top: 0.5rem;
  }
}
</style>
