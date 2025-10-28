<!-- page d'erreur -->
<script setup lang="ts">
defineProps({
  error: Object,
});

// Fonction pour retourner à la page précédente ou à l'accueil
const handleError = () => {
  // Effacer l'erreur et retourner à la page précédente
  clearError({ redirect: "/" });
};
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-icon">
        <!-- Icône de restauration pour rester dans le thème -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      </div>

      <h1 class="error-title">
        {{
          error?.statusCode === 404
            ? "Page introuvable"
            : "Une erreur est survenue"
        }}
      </h1>

      <p class="error-message">
        {{ error?.message || "Nous ne trouvons pas ce que vous cherchez." }}
      </p>

      <button @click="handleError" class="error-button">
        Retourner à l'accueil
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-container {
  min-height: 37.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  padding: 1rem;
}

.error-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.error-icon {
  color: #764ba2;
  margin-bottom: 1.5rem;
}

.error-title {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.error-message {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.error-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.error-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(118, 75, 162, 0.3);
}

@media (max-width: 480px) {
  .error-content {
    padding: 1.5rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-message {
    font-size: 0.9rem;
  }
}
</style>
