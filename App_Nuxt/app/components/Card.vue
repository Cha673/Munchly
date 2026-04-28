<!-- Carte qui affiche les données d'un restaurant dans le listing de restaurant-->
<script setup lang="ts">
defineProps<{
  imageUrl: string;
  nom: string;
  subtitle: string;
}>();
</script>

<template>
  <div class="resto-card">
    <NuxtImg
      :src="imageUrl"
      :alt="nom"
      class="resto-image"
      width="192"
      height="192"
      format="webp"
    />
    <div class="resto-info">
      <h2>{{ nom }}</h2>
      <p>{{ subtitle }}</p>
    </div>
  </div>
</template>

<style scoped>
.resto-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  width: 250px;
  margin: 0 auto;
  background-color: white;
  transition: all 0.2s ease;
  text-decoration: none !important;
  display: block;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  color: inherit;
}

.resto-card:hover {
  background-color: #f9fafb;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.resto-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.resto-info {
  padding: 1rem;
}

.resto-info h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.resto-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}
</style>
