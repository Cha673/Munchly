<!-- Affichage d'un restaurateur dans le listing pour les admin-->
<script setup lang="ts">
interface UserProps {
  id: number;
  nom: string;
  email: string;
  role: string;
}

const props = defineProps<UserProps>();

const emit = defineEmits<{
  (e: "delete", id: number): void;
}>();

const handleDelete = () => {
  emit("delete", props.id);
};
</script>

<template>
  <div class="user-card">
    <div class="user-info">
      <h3>{{ nom }}</h3>
      <p class="email">{{ email }}</p>
      <span class="role-badge">{{ role }}</span>
    </div>
    <div class="user-actions">
      <button class="delete-btn" @click="handleDelete">Supprimer</button>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.user-info {
  flex-grow: 1;
}

.user-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.25rem;
}

.email {
  color: #666;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #4a90e2;
  color: white;
  border-radius: 20px;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.user-actions {
  display: flex;
  gap: 1rem;
}

.delete-btn {
  background-color: #ff5a5f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.delete-btn:hover {
  background-color: #ff4246;
}
</style>
