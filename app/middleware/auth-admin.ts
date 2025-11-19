// middleware qui restreint l'accès aux administrateurs connectés uniquement
import { useUserStore } from "~/stores/users/user";
import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  const { $localePath } = useNuxtApp();

  // middleware désactivé pour les tests e2e
  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (
    !userStore.isUserAuthenticated ||
    userStore.currentUser?.role !== "admin"
  ) {
    return navigateTo($localePath("/"));
  }
});
