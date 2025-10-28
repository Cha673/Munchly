<!-- Page de gestion du restaurant pour le restaurateur -->
<script setup lang="ts">
definePageMeta({
  layout: "restaurateur",
  middleware: ["auth-restaurateur"],
});
import { ref, computed } from "vue";
import { useUserStore } from "~/stores/users/user";

const userStore = useUserStore();
const currentUser = computed(() => userStore.currentUser);

const formData = ref({
  name: currentUser.value?.name || "",
  email: currentUser.value?.email || "",
  password: "",
  confirmPassword: "",
});

const error = ref("");
const success = ref("");
const isEditing = ref(false);

// Fonction pour commencer l'édition
const startEditing = () => {
  formData.value = {
    name: currentUser.value?.name || "",
    email: currentUser.value?.email || "",
    password: "",
    confirmPassword: "",
  };
  isEditing.value = true;
};

// Fonction pour annuler l'édition
const cancelEditing = () => {
  isEditing.value = false;
  error.value = "";
  success.value = "";
};

// Valider le formulaire
const validateForm = () => {
  if (!formData.value.name || !formData.value.email) {
    error.value = "Le nom et l'email sont obligatoires";
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.value.email)) {
    error.value = "L'email n'est pas valide";
    return false;
  }

  if (
    formData.value.password &&
    formData.value.password !== formData.value.confirmPassword
  ) {
    error.value = "Les mots de passe ne correspondent pas";
    return false;
  }

  return true;
};

// Mettre à jour le profil
const updateProfile = async () => {
  error.value = "";
  success.value = "";

  if (!validateForm()) return;

  try {
    await userStore.updateProfile({
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password || currentUser.value?.password || "",
    });
    success.value = "Profil mis à jour avec succès";
    isEditing.value = false;
  } catch (err: any) {
    error.value = err.message || "Erreur lors de la mise à jour";
  }
};
</script>

<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="card-header">
        <h1>Mon Profil Restaurateur</h1>
        <button v-if="!isEditing" @click="startEditing" class="edit-btn">
          Modifier le profil
        </button>
      </div>

      <!-- Mode lecture -->
      <div v-if="!isEditing" class="profile-info">
        <div class="info-group">
          <label>Nom</label>
          <p>{{ currentUser?.name }}</p>
        </div>
        <div class="info-group">
          <label>Email</label>
          <p>{{ currentUser?.email }}</p>
        </div>
      </div>

      <!-- Mode édition -->
      <form v-else class="edit-form" @submit.prevent="updateProfile">
        <div class="form-group">
          <label>Nom</label>
          <input
            v-model="formData.name"
            type="text"
            required
            placeholder="Votre nom"
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            v-model="formData.email"
            type="email"
            required
            placeholder="votre@email.com"
          />
        </div>

        <div class="form-group">
          <label>Nouveau mot de passe (optionnel)</label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="Laissez vide pour ne pas changer"
          />
        </div>

        <div class="form-group" v-if="formData.password">
          <label>Confirmer le mot de passe</label>
          <input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="Confirmez le nouveau mot de passe"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="save-btn">Enregistrer</button>
          <button type="button" class="cancel-btn" @click="cancelEditing">
            Annuler
          </button>
        </div>
      </form>

      <!-- Messages -->
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">{{ success }}</div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.card-header h1 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
}

.profile-info {
  display: grid;
  gap: 1.5rem;
}

.info-group {
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.info-group label {
  color: #666;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.5rem;
}

.info-group p {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.edit-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-group label {
  color: #666;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  width: 100%;
}

.form-group input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.edit-btn,
.save-btn,
.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn {
  background-color: #4a90e2;
  color: white;
}

.save-btn {
  background-color: #4caf50;
  color: white;
}

.cancel-btn {
  background-color: #666;
  color: white;
}

.edit-btn:hover,
.save-btn:hover {
  filter: brightness(110%);
}

.cancel-btn:hover {
  background-color: #555;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 6px;
}

.success-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #e8f5e9;
  color: #2e7d32;
  border-radius: 6px;
}

@media (max-width: 768px) {
  .profile-card {
    padding: 1.5rem;
  }

  .card-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .form-actions {
    flex-direction: column;
  }

  .edit-btn,
  .save-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>
