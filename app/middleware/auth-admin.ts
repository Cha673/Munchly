// middleware qui restreint l'accès aux administrateurs connectés uniquement
import { useUserStore } from "~/stores/users/user";
import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  if (
    !userStore.isUserAuthenticated ||
    userStore.currentUser?.role !== "admin"
  ) {
    return navigateTo("/");
  }
});
