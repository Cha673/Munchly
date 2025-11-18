// middleware qui restreint l'accès aux restaurateurs connectés uniquement
import { useUserStore } from "~/stores/users/user";
import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  const { $localePath } = useNuxtApp();

  if (
    !userStore.isUserAuthenticated ||
    userStore.currentUser?.role !== "restaurateur"
  ) {
    return navigateTo($localePath("/"));
  }
});
