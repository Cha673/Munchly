<!-- Affichage des plats dans le panier et dans le détail d'une commande -->
<script setup lang="ts">
import { usePanierStore } from "~/stores/panier/panier";

const { t } = useI18n();

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
      <span class="qty">{{ t("dishes.quantity") }}: {{ quantite }}</span>
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
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.panier-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.1),
    0 4px 6px -1px rgba(0, 0, 0, 0.06);
}

.item-info {
  flex: 2;
}

.item-info h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #374151;
  font-weight: 600;
}

.item-prix {
  margin: 0.5rem 0 0;
  color: #4b5563;
  font-size: 1rem;
}

.item-quantite {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 2rem;
}

.btn-qty {
  width: 36px;
  height: 36px;
  border: 2px solid #4b5563;
  border-radius: 8px;
  background: white;
  color: #4b5563;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-qty:hover {
  background: #4b5563;
  color: white;
  transform: translateY(-1px);
}

.qty {
  min-width: 36px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: #374151;
}

.item-total {
  font-weight: 600;
  color: #4b5563;
  margin: 0 2rem;
  font-size: 1.2rem;
}

.btn-remove {
  width: 36px;
  height: 36px;
  border: 2px solid #ef4444;
  border-radius: 50%;
  background: white;
  color: #ef4444;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-remove:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .panier-item {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 1.25rem;
  }

  .item-info,
  .item-quantite,
  .item-total {
    margin: 0;
  }

  .item-info h3 {
    font-size: 1.1rem;
  }

  .item-prix {
    font-size: 0.95rem;
  }

  .item-quantite {
    justify-content: center;
  }

  .btn-qty {
    width: 32px;
    height: 32px;
  }

  .item-total {
    font-size: 1.1rem;
  }

  .btn-remove {
    margin-top: 0.5rem;
  }
}
</style>
