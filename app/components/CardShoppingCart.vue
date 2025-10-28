<script setup lang="ts">
defineProps<{
  imageUrl?: string;
  nom: string;
  price?: string;
  calcul?: string;
  description?: string;
}>();
</script>

<template>
  <div class="resto-card">
    <img :src="imageUrl" :alt="nom" class="resto-image" />
    <div class="resto-info">
      <h2>{{ nom }}</h2>
      <p>{{ price }}</p>
    </div>
  </div>
</template>

<style scoped>
.resto-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  width: 250px;
}

.resto-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.resto-info {
  padding: 10px;
}

.resto-info h2 {
  margin: 0;
  font-size: 1.2rem;
}

.resto-info p {
  margin: 4px 0 0;
  color: #555;
  font-size: 0.9rem;
}
</style>
