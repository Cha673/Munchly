<!-- Menu pour les utilisateurs connectés et non connectés -->
<script setup lang="ts">
import { ref } from "vue";
import { usePanierStore } from "~/stores/panier/panier";
import { useUserStore } from "~/stores/users/user";

const userStore = useUserStore();
const panierStore = usePanierStore();
const { t, locale } = useI18n();
const { $localePath } = useNuxtApp();

const isLoggedIn = computed(() => userStore.currentUser !== null);
const isMenuOpen = ref(false);

// Ferme le menu quand on clique sur un lien
const closeMenu = () => {
  isMenuOpen.value = false;
};

// Fonction pour basculer entre les langues
// La langue actuelle pour l'affichage
const currentLanguage = computed(() => locale.value.toUpperCase());
</script>

<template>
  <div>
    <div class="nav-container">
      <nav>
        <!-- Logo et éléments toujours visibles -->
        <NuxtLink :to="$localePath('/')" class="logo">
          <ClientOnly>
            <NuxtImg
              src="/images/logo/munchly-logo.png"
              alt="Munchly Logo"
              class="logo-img"
              width="192"
              height="192"
              format="webp"
            />
          </ClientOnly>
          <noscript>
            <img
              src="/images/logo/munchly-logo.png"
              alt="Munchly Logo"
              class="logo-img"
              width="192"
              height="192"
            />
          </noscript>
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
              <!-- Liens pour utilisateurs connectés -->
              <template v-if="isLoggedIn">
                <NuxtLink
                  :to="$localePath('/user/update_profil')"
                  @click="closeMenu"
                  >{{ t("header_profile") }}</NuxtLink
                >
                <NuxtLink
                  :to="$localePath('/user/commandes')"
                  @click="closeMenu"
                  >{{ t("header_user_orders") }}</NuxtLink
                >
                <NuxtLink :to="$localePath('/user/panier')" @click="closeMenu">
                  {{ t("header_user_cart") }}
                  <span v-if="panierStore.totalItems > 0"
                    >({{ panierStore.totalItems }})</span
                  >
                </NuxtLink>
              </template>
            </div>

            <!-- Boutons d'authentification dans le menu -->
            <div class="nav-actions">
              <template v-if="isLoggedIn">
                <a
                  href="#"
                  @click.prevent="userStore.logout"
                  class="logout-btn"
                >
                  {{ t("logout") }}
                </a>
              </template>
              <template v-else>
                <NuxtLink :to="$localePath('/login')" class="login-btn">
                  {{ t("login") }}
                </NuxtLink>
                <NuxtLink :to="$localePath('/register')" class="register-btn">
                  {{ t("register") }}
                </NuxtLink>
              </template>
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
<style>
@import "@/assets/css/layouts/navigation.css";
</style>
