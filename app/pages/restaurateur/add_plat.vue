<!-- Page d'un resturateur pour ajouter un plat -->
<script setup lang="ts">
definePageMeta({
  layout: "restaurateur",
  middleware: ["auth-restaurateur"],
});

import { ref } from "vue";
import { useUserStore } from "~/stores/users/user";

const userStore = useUserStore();
const currentUser = computed(() => userStore.currentUser);

// Vérifier que l'utilisateur est connecté et est un restaurateur
if (!currentUser.value || currentUser.value.role !== "restaurateur") {
  navigateTo("/login");
}

const loading = ref(false);
const error = ref<string | null>(null);
const newPlat = ref({
  nom: "",
  description: "",
  prix: "",
  imageUrl: "",
});

// Ajouter un nouveau plat
const addPlat = async () => {
  if (
    !newPlat.value.nom ||
    !newPlat.value.description ||
    !newPlat.value.prix ||
    !newPlat.value.imageUrl
  ) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  if (!currentUser.value?.id) {
    alert("Erreur : utilisateur non identifié");
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    await $fetch("/api/plats", {
      method: "POST",
      body: {
        restaurantId: currentUser.value.id,
        nom: newPlat.value.nom,
        description: newPlat.value.description,
        prix: parseFloat(newPlat.value.prix),
        imageUrl: newPlat.value.imageUrl,
      },
    });

    // Rediriger vers la liste des plats après l'ajout
    navigateTo("/restaurateur/plats");
  } catch (err) {
    console.error("Erreur lors de l'ajout du plat:", err);
    error.value = "Erreur lors de l'ajout du plat";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="add-plat-container">
    <div class="header">
      <h1>Ajouter un nouveau plat</h1>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Formulaire d'ajout de plat -->
    <form @submit.prevent="addPlat" class="plat-form">
      <div class="form-group">
        <label>Nom du plat</label>
        <input
          v-model="newPlat.nom"
          required
          placeholder="Ex: Pizza Margherita"
        />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea
          v-model="newPlat.description"
          required
          placeholder="Décrivez les ingrédients et la préparation"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Prix (€)</label>
        <input
          v-model="newPlat.prix"
          type="number"
          step="0.01"
          required
          placeholder="Ex: 12.90"
        />
      </div>

      <div class="form-group">
        <label>URL de l'image</label>
        <input
          v-model="newPlat.imageUrl"
          type="url"
          required
          placeholder="https://..."
        />
      </div>

      <div class="form-buttons">
        <NuxtLink to="/restaurateur/plats" class="cancel-button">
          Annuler
        </NuxtLink>
        <button type="submit" class="submit-button" :disabled="loading">
          {{ loading ? "Ajout en cours..." : "Ajouter le plat" }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-plat-container {
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.plat-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background: #e0e0e0;
  color: #333;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background: #d5d5d5;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background: #43a047;
}

.submit-button:disabled {
  background: #a5d6a7;
  cursor: not-allowed;
}
</style>
