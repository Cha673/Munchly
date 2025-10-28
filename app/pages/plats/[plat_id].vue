<!-- Page détail d'un plat
 Fonctionnalités: 
 - ajouter un plat au panier, seulement d'un même restaurant
 - accéder au panier-->
<script setup lang="ts">
definePageMeta({
  layout: "user",
  validate: (route) => !isNaN(parseInt(route.params.plat_id as string)),
  middleware: ["auth-user"],
});

import { ref } from "vue";
import { useRoute } from "#app";
import type { Plat } from "~/types/plats/plats";
import { usePanierStore } from "~/stores/panier/panier";
import { navigateTo } from "#app";

const route = useRoute();
const panierStore = usePanierStore();

const platId = Number(route.params.plat_id);
const plat = ref<Plat | null>(null);
const loading = ref(true);

const fetchPlat = async () => {
  loading.value = true;
  const { data } = await useFetch<Plat[]>("/api/plats", {
    params: { id: platId },
  });
  plat.value = data.value?.[0] || null;
  loading.value = false;
};

await fetchPlat();

const addToCart = () => {
  if (!plat.value) return;

  const result = panierStore.addPlat(plat.value);

  if (!result.success) {
    // Si le plat est d'un autre restaurant
    if (result.error === "different_restaurant") {
      const confirmer = window.confirm(
        "Vous avez déjà des plats d'un autre restaurant dans votre panier.\n\n" +
          "Voulez-vous voir votre panier actuel ?\n" +
          "- OK pour voir votre panier\n" +
          "- Annuler pour rester sur cette page"
      );

      if (confirmer) {
        // Rediriger vers le panier
        navigateTo("/user/panier");
      }
    }
  } else {
    // Le plat a été ajouté avec succès
    alert(`${plat.value.nom} ajouté au panier !`);
  }
};
</script>

<template>
  <div class="plat-detail">
    <div v-if="loading" class="loading">Chargement du plat...</div>

    <div v-else-if="plat" class="plat-card">
      <h1>{{ plat.nom }}</h1>
      <p class="description">{{ plat.description }}</p>
      <p class="prix">Prix : {{ plat.prix }} €</p>

      <div class="actions">
        <button @click="addToCart" class="btn-cart">Ajouter au panier</button>
        <NuxtLink to="/user/panier" class="btn-view-cart">
          Voir le panier ({{ panierStore.totalItems }})
        </NuxtLink>
      </div>
    </div>

    <div v-else class="not-found">
      <h2>Plat introuvable</h2>
      <NuxtLink to="/plats">Retour aux plats</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.plat-detail {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
}

.plat-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.plat-card h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.prix {
  font-size: 1.5rem;
  color: #27ae60;
  font-weight: bold;
  margin: 1rem 0;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cart {
  padding: 1rem 2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;
  flex: 1;
}

.btn-cart:hover {
  background: #764ba2;
}

.btn-view-cart {
  padding: 1rem 2rem;
  background: #27ae60;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.1rem;
  text-align: center;
  transition: background 0.3s;
}

.btn-view-cart:hover {
  background: #229954;
}

.not-found {
  text-align: center;
  padding: 4rem 0;
}

.not-found h2 {
  color: #999;
  margin-bottom: 1rem;
}

.not-found a {
  color: #667eea;
  text-decoration: none;
  font-size: 1.1rem;
}
</style>
