<!-- Menu pour les restaurateurs -->
<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "~/stores/users/user";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const userStore = useUserStore();
const isMenuOpen = ref(false);

const handleLogout = async () => {
  userStore.logout();
  await navigateTo("/login");
};

// Ferme le menu quand on clique sur un lien
const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<template>
  <div>
    <div class="nav-container">
      <nav>
        <!-- Logo et éléments toujours visibles -->
        <NuxtLink to="/restaurateur" class="logo">
          {{ t("header_home") }}
        </NuxtLink>

        <!-- Conteneur pour langue et burger -->
        <div class="nav-right">
          <!-- Sélecteur de langue visible en mobile -->
          <div class="language-switcher">
            <NuxtLink v-if="locale !== 'en'" :to="$switchLocalePath('en')"
              >En</NuxtLink
            >
            <NuxtLink v-if="locale !== 'fr'" :to="$switchLocalePath('fr')"
              >Fr</NuxtLink
            >
          </div>

          <!-- Bouton burger -->
          <button
            class="burger-menu"
            :class="{ active: isMenuOpen }"
            @click="isMenuOpen = !isMenuOpen"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <!-- Menu principal -->
          <div class="nav-menu" :class="{ active: isMenuOpen }">
            <div class="menu-links">
              <NuxtLink to="/restaurateur/mon-restaurant" @click="closeMenu">
                {{ t("header_restaurateur_dashboard") }}
              </NuxtLink>
              <NuxtLink to="/restaurateur/plats" @click="closeMenu">
                {{ t("header_plats") }}
              </NuxtLink>
              <NuxtLink to="/restaurateur/commandes" @click="closeMenu">
                {{ t("header_restaurateur_orders") }}
              </NuxtLink>
            </div>

            <!-- Boutons d'authentification dans le menu -->
            <div class="nav-actions">
              <button @click="handleLogout" class="logout-btn">
                {{ t("logout") }}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <main>
      <slot></slot>
    </main>
  </div>
</template>
