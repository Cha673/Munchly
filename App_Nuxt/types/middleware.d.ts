// Déclaration de types pour les middlewares de l'application

import type { NavigationGuard } from "vue-router";

declare module "#app" {
  interface PageMeta {
    middleware?: string | string[];
  }
}

declare module "nuxt/schema" {
  interface MiddlewareDefinition {
    auth: NavigationGuard;
  }
}

export {};
