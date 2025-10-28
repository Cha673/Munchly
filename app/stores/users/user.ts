// Store Pinia pour la gestion des utilisateurs
import { defineStore } from "pinia";
import type { User } from "~/types/utilisateurs/users";
import usersData from "../../../server/api/data/users.json";

// Récupérer l'état d'authentification du localStorage
const authStored = process.client ? localStorage.getItem("auth_state") : null;
const initialAuthState = authStored
  ? JSON.parse(authStored)
  : {
      user: null,
      isAuthenticated: false,
    };

export const useUserStore = defineStore("user", {
  state: () => ({
    users: usersData as User[],
    user: initialAuthState.user as User | null,
    isAuthenticated: initialAuthState.isAuthenticated as boolean,
  }),

  getters: {
    // Utilisateur actuellement connecté
    currentUser: (state): User | null => state.user,
    // Liste des users avec le role "restaurateur"
    getRestaurateurs: (state) =>
      state.users.filter((user) => user.role === "restaurateur"),
    // Ajout d'un getter pour vérifier l'authentification
    isUserAuthenticated: (state): boolean => {
      return state.isAuthenticated && state.user !== null;
    },
  },

  actions: {
    // Enregistrer un nouvel utilisateur
    register(user: User) {
      const exists = this.users.some((u) => u.email === user.email);
      if (exists) throw new Error("Cet utilisateur existe déjà");
      this.users.push(user);
      this.user = user;
      this.isAuthenticated = true;

      // Sauvegarder dans le localStorage
      if (process.client) {
        localStorage.setItem(
          "auth_state",
          JSON.stringify({
            user: this.user,
            isAuthenticated: this.isAuthenticated,
          })
        );
      }
    },

    // Connexion d'un utilisateur
    login(credentials: { email: string; password: string }): User {
      // Recherche de l'utilisateur
      const user = this.users.find(
        (u) =>
          u.email === credentials.email && u.password === credentials.password
      );

      // Si l'utilisateur n'est pas trouvé, on lance une erreur
      if (!user) {
        throw new Error("Email ou mot de passe incorrect");
      }

      // Mise à jour du state
      this.user = user;
      this.isAuthenticated = true;

      // Sauvegarder dans le localStorage
      if (process.client) {
        localStorage.setItem(
          "auth_state",
          JSON.stringify({
            user: this.user,
            isAuthenticated: this.isAuthenticated,
          })
        );
      }

      return user;
    },

    // Déconnexion de l'utilisateur
    logout() {
      this.user = null;
      this.isAuthenticated = false;

      // Nettoyer le localStorage
      if (process.client) {
        localStorage.removeItem("auth_state");
      }
    },

    // Mise à jour du profil utilisateur
    updateProfile(updatedFields: {
      name: string;
      email: string;
      password: string;
    }) {
      if (!this.user) throw new Error("Aucun utilisateur connecté");

      const index = this.users.findIndex((u) => u.id === this.user!.id);
      if (index === -1) throw new Error("Utilisateur introuvable");

      // Création d'un nouvel objet User strictement typé
      const updatedUser: User = {
        id: this.user.id, // inchangé
        role: this.user.role, // inchangé
        name: updatedFields.name,
        email: updatedFields.email,
        password: updatedFields.password,
      };

      this.users[index] = updatedUser;
      this.user = updatedUser;
    },

    // Suppression d'un utilisateur par ID
    deleteUser(userId: number) {
      const index = this.users.findIndex((u) => u.id === userId);
      if (index === -1) throw new Error("Utilisateur introuvable");
      this.users.splice(index, 1);
    },

    // Ajout d'un nouveau restaurateur
    addRestaurateur(newUser: Omit<User, "id">) {
      const maxId = Math.max(...this.users.map((u) => u.id));
      const userWithId: User = {
        ...newUser,
        id: maxId + 1,
        role: "restaurateur",
      };
      this.users.push(userWithId);
      return userWithId;
    },
  },
});
