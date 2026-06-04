<!-- Menu pour les restaurateurs -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useUserStore } from "~/stores/users/user";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const userStore = useUserStore();
const isMenuOpen = ref(false);
const { $localePath } = useNuxtApp();

// État de notre notification custom
const toastState = ref({
  show: false,
  title: "",
  message: "",
  type: "success",
});
let toastTimeout: NodeJS.Timeout | null = null;

const showNotification = (title: string, message: string, type = "success") => {
  if (toastTimeout) clearTimeout(toastTimeout);
  toastState.value = { show: true, title, message, type };
  // Masque la notif automatiquement après 6 secondes
  toastTimeout = setTimeout(() => {
    toastState.value.show = false;
  }, 6000);
};

// WebSocket pour les notifications en temps réel
let socket: WebSocket | null = null;
const config = useRuntimeConfig();

onMounted(() => {
  if (userStore.token) {
    // Note: par défaut l'API écoute sur localhost:3000.
    const wsUrl = "ws://localhost:3000/ws/restaurant";
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("🟢 Connecté au WebSocket pour le restaurateur !");
      socket?.send(
        JSON.stringify({
          event: "auth",
          token: userStore.token,
        }),
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "connected") {
        console.log("✅ " + data.message);
      }

      // Réception d'une notification de nouvelle commande
      if (data.event === "new-order") {
        showNotification(
          "🎉 Nouvelle Commande !",
          `Montant total : ${data.data?.totalPrice || "?"}€`,
          "success",
        );
        console.log("Nouvelle commande reçue:", data.data);
      }
      // Modification de l'état (ex: par l'utilisateur ou le système)
      if (data.event === "order-status-updated") {
        showNotification(
          "🔔 Mise à jour commande",
          `Nouveau statut : ${data.data?.status}`,
          "info",
        );
      }
    };

    socket.onerror = (error) => console.error("🔴 Erreur WebSocket", error);
    socket.onclose = () => console.log("⚪ Déconnecté du WebSocket");
  }
});

onUnmounted(() => {
  if (socket) socket.close();
});

const handleLogout = async () => {
  if (socket) socket.close();
  userStore.logout();
  await navigateTo($localePath("/login"));
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
        <NuxtLink :to="$localePath('/restaurateur')" class="logo">
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
              <NuxtLink
                :to="$localePath('/restaurateur/mon-restaurant')"
                @click="closeMenu"
              >
                {{ t("header_restaurateur_dashboard") }}
              </NuxtLink>
              <NuxtLink
                :to="$localePath('/restaurateur/plats')"
                @click="closeMenu"
              >
                {{ t("header_plats") }}
              </NuxtLink>
              <NuxtLink
                :to="$localePath('/restaurateur/commandes')"
                @click="closeMenu"
              >
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

    <!-- Custom Toast Notification -->
    <Transition name="toast-slide">
      <div v-if="toastState.show" class="custom-toast" :class="toastState.type">
        <div class="toast-content">
          <h4>{{ toastState.title }}</h4>
          <p>{{ toastState.message }}</p>
        </div>
        <button class="toast-close" @click="toastState.show = false">
          &times;
        </button>
      </div>
    </Transition>
  </div>
</template>

<style>
@import "@/assets/css/layouts/navigation.css";

/* Styles du Toast Custom (Notification Pop-up) */
.custom-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  z-index: 9999;
  color: white;
  min-width: 250px;
  max-width: 350px;
  font-family: inherit;
}

.custom-toast.success {
  background-color: #10b981; /* Joli Vert réussite */
}
.custom-toast.info {
  background-color: #3b82f6; /* Joli Bleu info */
}

.toast-content h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}
.toast-content p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.toast-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  opacity: 0.7;
  padding: 0;
  line-height: 1;
  margin-left: auto; /* Pousse la croix vers la droite */
}
.toast-close:hover {
  opacity: 1;
}

/* Animation fluide pour faire glisser le popup */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
