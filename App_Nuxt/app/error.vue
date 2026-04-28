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
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
  background-color: #f9fafb;
}

.error-content {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.06);
  text-align: center;
  max-width: 480px;
  width: 100%;
}

.error-icon {
  color: #4b5563;
  margin-bottom: 2rem;
  transition: transform 0.3s ease;
}

.error-icon:hover {
  transform: scale(1.1);
}

.error-title {
  color: #374151;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  position: relative;
}

.error-title::after {
  content: "";
  position: absolute;
  bottom: -0.75rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #4b5563;
  border-radius: 2px;
}

.error-message {
  color: #4b5563;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.error-button {
  background-color: #4b5563;
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.error-button:hover {
  background-color: #374151;
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  .error-container {
    padding: 1.5rem;
  }

  .error-content {
    padding: 2rem;
  }

  .error-icon svg {
    width: 48px;
    height: 48px;
  }

  .error-title {
    font-size: 1.75rem;
    margin-bottom: 1.25rem;
  }

  .error-message {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .error-button {
    width: 100%;
    padding: 0.875rem 2rem;
  }
}
</style>
