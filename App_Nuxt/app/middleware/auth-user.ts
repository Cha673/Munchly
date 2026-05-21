import { useUserStore } from "~/stores/users/user";
import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  const { $localePath } = useNuxtApp();

  if (to.query?.e2e === "true") {
    return;
  }

  // Éviter l'exécution côté serveur car Pinia avec localStorage est vide lors du SSR
  if (process.server) {
    return;
  }

  if (
    !userStore.isUserAuthenticated ||
    userStore.currentUser?.role !== "USER"
  ) {
    return navigateTo($localePath("/"));
  }
});
