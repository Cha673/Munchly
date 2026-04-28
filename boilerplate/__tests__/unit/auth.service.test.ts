import { describe, it, expect, beforeEach, vi } from "vitest";
import AuthService from "../../services/auth.service.js";
import { ConflictError, UnauthorizedError } from "../../common/exceptions.js";
import { hash } from "bcryptjs";

describe("Auth Service - Unit Tests", () => {
  let prisma: any;
  let authService: AuthService;

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();

    // Créer un mock de Prisma
    prisma = {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
    };

    authService = new AuthService(prisma);
  });

  describe("register", () => {
    it("devrait enregistrer un nouvel utilisateur avec un email valide", async () => {
      const input = {
        email: "newuser@example.com",
        password: "password123",
      };

      // pas d'utilisateur existant
      prisma.user.findUnique.mockResolvedValue(null);

      // resultat de la creation du user
      prisma.user.create.mockResolvedValue({
        id: "user-123",
        email: input.email,
        password: expect.any(String), // N'importe quel string (le hash)
        role: "USER",
      });

      // appel de la fonction de register avec les infos user
      const result = await authService.register(input);

      // verifier le resultat
      expect(result).toEqual({
        id: "user-123",
        email: "newuser@example.com",
        role: "USER",
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: input.email },
      });
      expect(prisma.user.create).toHaveBeenCalled();
    });
    it("devrait lancer une ConflictError si l'email existe déjà", async () => {
      // ARRANGE
      const input = {
        email: "existing@example.com",
        password: "password123",
      };

      // Mock findUnique pour retourner un utilisateur existant
      prisma.user.findUnique.mockResolvedValue({
        id: "user-456",
        email: input.email,
        password: "hashedPassword123",
        role: "USER",
      });

      // ACT & ASSERT
      // Vérifier que register() lance une ConflictError
      await expect(authService.register(input)).rejects.toThrow(ConflictError);

      // Vérifier que create() n'a pas été appelé
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("devrait loguer un utilisateur avec des identifiants valides", async () => {
      // ARRANGE
      const input = {
        email: "user@example.com",
        password: "password123",
      };

      // Créer un vrai hash du mot de passe avec bcryptjs
      const hashedPassword = await hash(input.password, 10);

      // Mock findUnique pour retourner un utilisateur avec le bon hash
      prisma.user.findUnique.mockResolvedValue({
        id: "user-456",
        email: "user@example.com",
        password: hashedPassword,
        role: "USER",
      });

      // ACT
      // Appeler login()
      const result = await authService.login(input);

      // ASSERT
      // Vérifier que le résultat contient id, email et role
      expect(result).toEqual({
        id: "user-456",
        email: "user@example.com",
        role: "USER",
      });
    });

    it("devrait lancer une UnauthorizedError si l'utilisateur n'existe pas", async () => {
      // 1️⃣ ARRANGE
      const input = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      // Mock findUnique pour retourner null
      prisma.user.findUnique.mockResolvedValue(null);

      // ACT & ASSERT
      // Vérifier que login() lance une UnauthorizedError
      await expect(authService.login(input)).rejects.toThrow(UnauthorizedError);
    });

    it("devrait lancer une UnauthorizedError si le mot de passe est incorrect", async () => {
      // 1️⃣ ARRANGE
      const input = {
        email: "user@example.com",
        password: "wrongpassword",
      };

      // Mock findUnique avec un utilisateur ayant un autre hash
      prisma.user.findUnique.mockResolvedValue({
        id: "user-789",
        email: "user@example.com",
        password: "$2a$10$fakehashedpassword123456789",
        role: "USER",
      });

      // ACT & ASSERT
      // Vérifier que login() lance une UnauthorizedError
      await expect(authService.login(input)).rejects.toThrow(UnauthorizedError);
    });
  });
});
