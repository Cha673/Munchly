import { useUserStore } from "~/stores/users/user";
import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  // Si l'utilisateur n'est pas authentifié OU n'est pas un admin
  if (
    !userStore.isUserAuthenticated ||
    userStore.currentUser?.role !== "admin"
  ) {
    return navigateTo("/");
  }
});
