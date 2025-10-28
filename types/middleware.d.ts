import type { NavigationGuard } from "vue-router";

declare module "#app" {
  interface PageMeta {
    middleware?: string | string[];
  }
}

declare module "nuxt/schema" {
  interface RuntimeConfig {
    // Define your runtime config schema here
  }
  interface MiddlewareDefinition {
    auth: NavigationGuard;
  }
}

export {};
