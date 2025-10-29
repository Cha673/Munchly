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
      <div class="plat-image">
        <img :src="plat.imageUrl" :alt="plat.nom" />
      </div>
      <div class="plat-content">
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
    </div>

    <div v-else class="not-found">
      <h2>Plat introuvable</h2>
      <NuxtLink to="/plats">Retour aux plats</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.plat-detail {
  background-color: #f9fafb;
  min-height: calc(100vh - 80px);
  padding: 2rem;
}

.loading {
  text-align: center;
  color: #4b5563;
  font-size: 1.1rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.plat-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.plat-image {
  width: 100%;
  height: 400px;
  position: relative;
  overflow: hidden;
  background-color: #f3f4f6;
}

.plat-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
  display: block;
}

.plat-image:hover img {
  transform: scale(1.05);
}

.plat-content {
  padding: 2.5rem;
}

.plat-card h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #374151;
  font-weight: 600;
  position: relative;
}

.plat-card h1::after {
  content: "";
  position: absolute;
  bottom: -0.75rem;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: #4b5563;
  border-radius: 2px;
}

.description {
  font-size: 1.1rem;
  color: #4b5563;
  margin: 1.5rem 0;
  line-height: 1.8;
}

.prix {
  font-size: 1.75rem;
  color: #4b5563;
  font-weight: 600;
  margin: 1.5rem 0;
  padding: 1rem 0;
  border-top: 2px solid #e5e7eb;
  border-bottom: 2px solid #e5e7eb;
}

.actions {
  display: flex;
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.btn-cart {
  padding: 1rem 2rem;
  background-color: #4b5563;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.btn-cart:hover {
  background-color: #374151;
  transform: translateY(-1px);
}

.btn-view-cart {
  padding: 1rem 2rem;
  background-color: white;
  color: #4b5563;
  text-decoration: none;
  border: 2px solid #4b5563;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  transition: all 0.2s ease;
}

.btn-view-cart:hover {
  background-color: #4b5563;
  color: white;
  transform: translateY(-1px);
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.not-found h2 {
  color: #4b5563;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.not-found a {
  color: #4b5563;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border: 2px solid #4b5563;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: inline-block;
}

.not-found a:hover {
  background-color: #4b5563;
  color: white;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .plat-detail {
    padding: 0;
  }

  .plat-image {
    height: 300px;
  }

  .plat-content {
    padding: 1.5rem;
  }

  .plat-card h1 {
    font-size: 2rem;
  }

  .description {
    font-size: 1rem;
  }

  .prix {
    font-size: 1.5rem;
  }

  .actions {
    flex-direction: column;
  }

  .btn-cart,
  .btn-view-cart {
    width: 100%;
  }
}
</style>
