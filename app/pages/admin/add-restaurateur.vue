<!-- Page d'ajout d'un nouveau restaurateur
  Formulaire permettant à l'administrateur d'ajouter un nouveau compte restaurateur
 -->
<script setup lang="ts">
import { useUserStore } from "~/stores/users/user";
import { ref } from "vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth-admin"],
});

const userStore = useUserStore();
const router = useRouter();

const newUser = ref({
  name: "",
  email: "",
  password: "",
});

const handleAddRestaurateur = async () => {
  try {
    userStore.addRestaurateur({
      ...newUser.value,
      role: "restaurateur",
    });
    await navigateTo("/admin");
  } catch (error: any) {
    alert(error.message);
  }
};
</script>

<template>
  <div class="add-restaurateur">
    <div class="header">
      <h1>Ajouter un Restaurateur</h1>
      <NuxtLink to="/admin" class="back-btn">Retour au dashboard</NuxtLink>
    </div>

    <form @submit.prevent="handleAddRestaurateur" class="add-form">
      <div class="form-group">
        <label for="name">Nom</label>
        <input
          id="name"
          v-model="newUser.name"
          type="text"
          placeholder="Nom du restaurateur"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="newUser.email"
          type="email"
          placeholder="Email"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input
          id="password"
          v-model="newUser.password"
          type="password"
          placeholder="Mot de passe"
          required
        />
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn">
          Ajouter le restaurateur
        </button>
        <NuxtLink to="/admin" class="cancel-btn">Annuler</NuxtLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-restaurateur {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-btn {
  background-color: #666;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.add-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-btn {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.cancel-btn {
  background-color: #666;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  text-align: center;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
