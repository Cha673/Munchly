import { useUserStore } from "~/stores/users/user";
import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  const { $localePath } = useNuxtApp();

  if (to.query?.e2e === "true") {
    return;
  }
  if (
    !userStore.isUserAuthenticated ||
    userStore.currentUser?.role !== "user"
  ) {
    return navigateTo($localePath("/"));
  }
});
