// Store Pinia pour la gestion des utilisateurs
import { defineStore } from "pinia";
import type { User } from "~/types/utilisateurs/users";

// Récupérer l'état d'authentification du localStorage
const authStored = process.client ? localStorage.getItem("auth_state") : null;
const initialAuthState = authStored
  ? JSON.parse(authStored)
  : {
      user: null,
      token: null,
      isAuthenticated: false,
    };

export const useUserStore = defineStore("user", {
  state: () => ({
    user: initialAuthState.user as User | null,
    token: initialAuthState.token as string | null,
    isAuthenticated: initialAuthState.isAuthenticated as boolean,
    usersList: [] as User[],
  }),

  getters: {
    currentUser: (state): User | null => state.user,
    isUserAuthenticated: (state): boolean => {
      // @ts-ignore
      return (
        state.isAuthenticated && state.user !== null && state.token != null
      );
    },
    getRestaurateurs: (state): User[] => {
      return state.usersList.filter(
        (u) => u.role === "RESTAURANT" || u.role === "restaurateur",
      );
    },
  },

  actions: {
    async fetchUsers() {
      const api = useApi();
      try {
        const response: any = await api("/users", {
          method: "GET",
        });
        this.usersList = response;
      } catch (error: any) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      }
    },
    async register(user: User) {
      const api = useApi();
      try {
        await api("/auth/register", {
          method: "POST",
          body: {
            email: user.email,
            password: user.password,
          },
        });

        await this.login({
          email: user.email,
          password: user.password,
        });
      } catch (error: any) {
        throw new Error(
          error.response?._data?.message ||
            error.response?._data?.detail ||
            error.message ||
            "Erreur lors de l'inscription",
        );
      }
    },

    async addRestaurateur(payload: {
      email: string;
      password: string;
      name?: string;
    }) {
      const api = useApi();
      try {
        const response: any = await api("/auth/register-restaurant", {
          method: "POST",
          body: {
            email: payload.email,
            password: payload.password,
          },
        });

        // Si on a un nom, on créé le restaurant directement avec le user nouvellement créé
        if (payload.name && response.user?.id) {
          await api("/restaurants", {
            method: "POST",
            body: {
              nom: payload.name,
              lieu: "Adresse à définir",
              description: "Nouveau restaurant",
              imageUrl: "https://placehold.co/400x400/png",
              ownerId: response.user.id,
            },
          });
        }

        return response;
      } catch (error: any) {
        throw new Error(
          error.response?._data?.message ||
            error.response?._data?.detail ||
            error.message ||
            "Erreur lors de la création du restaurateur",
        );
      }
    },

    async login(credentials: { email: string; password: string }) {
      const api = useApi();

      try {
        const response: any = await api("/auth/login", {
          method: "POST",
          body: credentials,
        });

        this.token = response.token;
        this.isAuthenticated = true;

        if (process.client) {
          localStorage.setItem(
            "auth_state",
            JSON.stringify({
              user: null, // On met user à null car on ne l'a pas encore, mais le localstorage doit exister
              token: this.token,
              isAuthenticated: this.isAuthenticated,
            }),
          );
        }

        // AU LIEU DE FAIRE APPEL A USEAPI, ON FORCE "$fetch" POUR PASSER LE TOKEN A LA MAIN.
        const config = useRuntimeConfig();
        const userData: any = await $fetch("/auth/me", {
          baseURL: config.public.apiBaseUrl,
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        this.user = userData;

        if (process.client) {
          localStorage.setItem(
            "auth_state",
            JSON.stringify({
              user: this.user,
              token: this.token,
              isAuthenticated: this.isAuthenticated,
            }),
          );
        }

        return this.user;
      } catch (error: any) {
        throw new Error(
          error.response?._data?.message ||
            error.response?._data?.detail ||
            error.message ||
            "Email ou mot de passe incorrect",
        );
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      if (process.client) {
        localStorage.removeItem("auth_state");
      }
    },
  },
});
