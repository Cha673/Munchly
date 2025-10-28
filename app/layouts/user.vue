<!-- Menu pour les utilisateurs connectés et non connectés -->
<script setup lang="ts">
import { usePanierStore } from "~/stores/panier/panier";
import { useUserStore } from "~/stores/users/user";

const userStore = useUserStore();
const panierStore = usePanierStore();
const { t, locale } = useI18n();

const isLoggedIn = computed(() => userStore.currentUser !== null);

// Fonction pour basculer entre les langues
// La langue actuelle pour l'affichage
const currentLanguage = computed(() => locale.value.toUpperCase());
</script>

<template>
  <div>
    <nav class="navigation">
      <div class="nav-container">
        <!-- Boutons de changement de langue -->
        <div class="language-switcher">
          <NuxtLink :to="$switchLocalePath('en')">English</NuxtLink>
          <NuxtLink :to="$switchLocalePath('fr')">Français</NuxtLink>
        </div>
        <div class="nav-links">
          <NuxtLink to="/">
            <span>{{ t("header_home") }}</span></NuxtLink
          >
          <NuxtLink to="/restaurants"
            ><span>{{ t("header_restaurants") }}</span></NuxtLink
          >

          <!-- Liens pour utilisateurs connectés -->
          <template v-if="isLoggedIn">
            <NuxtLink to="/user/update_profil"
              ><span>{{ t("header_profile") }}</span></NuxtLink
            >
            <NuxtLink to="/user/commandes"
              ><span>{{ t("header_user_orders") }}</span></NuxtLink
            >
            <NuxtLink to="/user/panier">
              <span>{{ t("header_user_cart") }}</span>
              <span v-if="panierStore.totalItems > 0"
                >({{ panierStore.totalItems }})</span
              >
            </NuxtLink>
            <a href="#" @click.prevent="userStore.logout" class="logout-btn">
              <span>{{ t("logout") }}</span>
            </a>
          </template>

          <!-- Liens pour utilisateurs non connectés -->
          <template v-else>
            <NuxtLink to="/login" class="login-btn">
              <span>{{ t("login") }}</span>
            </NuxtLink>
            <NuxtLink to="/register" class="register-btn">
              <span>{{ t("register") }}</span>
            </NuxtLink>
          </template>
        </div>
      </div>
    </nav>

    <main>
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.navigation {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
  width: 100%;
  z-index: 1000;
  transition: all 0.3s ease;
}

/* Sur écrans larges : nav en haut */
@media (min-width: 1400px) {
  .navigation {
    position: absolute;
    top: 0;
    bottom: auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
}
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-links a.router-link-active {
  background: rgba(255, 255, 255, 0.3);
}

.login-btn,
.register-btn,
.logout-btn {
  padding: 0.5rem 1.5rem !important;
  border: 2px solid white !important;
  font-weight: bold !important;
}

.login-btn:hover,
.register-btn:hover,
.logout-btn:hover {
  background: white !important;
  color: #764ba2 !important;
}

.register-btn {
  background: white !important;
  color: #764ba2 !important;
}

.register-btn:hover {
  background: rgba(255, 255, 255, 0.9) !important;
}

.language-switcher {
  display: flex;
  gap: 0.5rem;
  position: absolute;
  right: 2rem;
}

.language-switcher a {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  text-decoration: none;
}

.language-switcher a:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.language-switcher a.active {
  background: white;
  color: #764ba2;
}
</style>
