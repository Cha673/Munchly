<script setup lang="ts">
import { useUserStore } from "~/stores/users/user";
import type { User } from "~/types/utilisateurs/users";
import { ref, computed } from "vue";
import UserCard from "~/components/UserCard.vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth-admin"],
});

const userStore = useUserStore();
const restaurateurs = computed(() => userStore.getRestaurateurs);

const handleLogout = async () => {
  userStore.logout();
  await navigateTo("/login");
};

const handleDeleteUser = (userId: number) => {
  try {
    userStore.deleteUser(userId);
  } catch (error: any) {
    alert(error.message);
  }
};

const showAddForm = ref(false);
const newUser = ref({
  name: "",
  email: "",
  password: "",
});

const handleAddRestaurateur = () => {
  try {
    userStore.addRestaurateur({
      ...newUser.value,
      role: "restaurateur",
    });
    showAddForm.value = false;
    newUser.value = { name: "", email: "", password: "" };
  } catch (error: any) {
    alert(error.message);
  }
};
</script>

<template>
  <div class="admin-dashboard">
    <div class="header">
      <h1>Dashboard Administrateur</h1>
      <button class="logout-btn" @click="handleLogout">Se déconnecter</button>
    </div>

    <div class="restaurateurs-section">
      <div class="section-header">
        <h2>Liste des Restaurateurs</h2>
        <button v-if="!showAddForm" class="add-btn" @click="showAddForm = true">
          Ajouter un restaurateur
        </button>
      </div>

      <!-- Formulaire d'ajout -->
      <div v-if="showAddForm" class="add-form">
        <h3>Nouveau Restaurateur</h3>
        <div class="form-group">
          <input
            v-model="newUser.name"
            type="text"
            placeholder="Nom"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="newUser.email"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="newUser.password"
            type="password"
            placeholder="Mot de passe"
            required
          />
        </div>
        <div class="form-actions">
          <button class="submit-btn" @click="handleAddRestaurateur">
            Ajouter
          </button>
          <button class="cancel-btn" @click="showAddForm = false">
            Annuler
          </button>
        </div>
      </div>

      <!-- Liste des restaurateurs -->
      <div class="users-list">
        <UserCard
          v-for="user in restaurateurs"
          :key="user.id"
          :id="user.id"
          :nom="user.name"
          :email="user.email"
          :role="user.role"
          @delete="handleDeleteUser"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.logout-btn {
  background-color: #ff5a5f;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.add-btn {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.add-form {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.submit-btn {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #666;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
