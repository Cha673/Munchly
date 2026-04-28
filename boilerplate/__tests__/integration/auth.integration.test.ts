import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { FastifyInstance } from "fastify";
import { createTestServer, closeTestServer } from "../utils/test-setup.js";
import { prisma } from "../../plugins/prismaInstance.js";

describe("Authentication Integration Tests", () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    // Avant TOUS les tests : démarrer le serveur
    server = await createTestServer();
  }, 30000); // 👈 Ajout d'un timeout énorme au cas où Fastify met un petit peu de temps à se monter

  afterAll(async () => {
    // Après TOUS les tests : arrêter le serveur
    await closeTestServer(server);
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    // Avant CHAQUE test : nettoyer la base de données de l'application
    // On efface d'abord les tables qui ont des clés étrangères vers User
    try {
      await prisma.order.deleteMany();
      await prisma.restaurant.deleteMany();
      await prisma.user.deleteMany();
    } catch (error) {
      console.error("Erreur Prisma pendant le nettoyage :", error);
    }
  }, 15000); // 👈 Passe de 10s (limite de base de Vitest) à 15 secondes pour laisser le temps à MariaDB

  describe("POST /api/auth/register", () => {
    it("should register a new user and return a valid JWT token", async () => {
      // ARRANGE
      const newUser = {
        email: "test@example.com",
        password: "password123",
      };

      // ACT - Envoyer une requête POST
      const response = await server.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: newUser,
      });

      // ASSERT - Vérifier les résultats
      // Remplacer 201 par ce dont le code source a besoin, souvent 200 ou 201
      expect(response.statusCode).toBe(201); // 201 = Created
      expect(response.json()).toHaveProperty("token");

      // Vérifier que le token est valide
      const token = response.json().token;
      expect(token).toBeTruthy();
      expect(typeof token).toBe("string");

      // Vérifier que l'utilisateur est réellement dans la base de données
      const user = await prisma.user.findUnique({
        where: { email: "test@example.com" },
      });
      expect(user).toBeDefined();
      expect(user?.email).toBe("test@example.com");
    });

    it("should reject registration with invalid email format", async () => {
      // 1️⃣ ARRANGE
      const invalidUser = {
        email: "invalid-email", // ❌ Pas de @
        password: "password123",
      };

      // 2️⃣ ACT
      // Envoyer une requête POST vers /api/auth/register
      const response = await server.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: invalidUser,
      });

      // 3️⃣ ASSERT
      // Vérifier que le status est 400 (Bad Request)
      expect(response.statusCode).toBe(400);

      // Vérifier que l'utilisateur n'est PAS dans la base de données
      const user = await prisma.user.findUnique({
        where: { email: "invalid-email" },
      });
      expect(user).toBeNull();
    });

    it("should return 409 when email already exists", async () => {
      // ARRANGE
      const userPayload = {
        email: "duplicate@example.com",
        password: "password123",
      };

      // Créer le premier utilisateur
      const firstResponse = await server.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: userPayload,
      });

      // Vérification que le premier est bien passé
      expect(firstResponse.statusCode).toBe(201); // ou 200

      // ACT - Tentative de créer un utilisateur avec le même email
      const secondResponse = await server.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: {
          ...userPayload,
          password: "differentpassword", // Password différent, email identique
        },
      });

      // 3️⃣ ASSERT
      // Vérifier que le status est 409 (Conflict)
      expect(secondResponse.statusCode).toBe(409);

      // Vérifier que la réponse contient "conflict" (ou le message d'erreur approprié)
      const data = secondResponse.json();
      expect(data.title.toLowerCase()).toContain("conflict");

      // Vérifier qu'il n'y a qu'UN utilisateur dans la base de données
      const userCount = await prisma.user.count({
        where: { email: "duplicate@example.com" },
      });
      expect(userCount).toBe(1);
    });
  });
  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Avant chaque test de login, créer un utilisateur de test
      await server.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: {
          email: "login@example.com",
          password: "correctpassword",
        },
      });
    });

    it("should login with valid credentials and return JWT token", async () => {
      // ARRANGE
      const credentials = {
        email: "login@example.com",
        password: "correctpassword",
      };

      // 2️⃣ ACT
      // Envoyer une requête POST vers /api/auth/login
      const response = await server.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: credentials,
      });

      // 3️⃣ ASSERT
      // Vérifier que le status est 200 (OK)
      expect(response.statusCode).toBe(200);

      // Vérifier que la réponse contient un token
      const responseData = response.json();
      expect(responseData).toHaveProperty("token");

      // Vérifier que le token est une string non-vide
      expect(typeof responseData.token).toBe("string");
      expect(responseData.token.length).toBeGreaterThan(0);
    });

    it("should return 401 for non-existent user", async () => {
      // ARRANGE
      const credentials = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      // 2️⃣ ACT
      // Envoyer une requête POST vers /api/auth/login
      const response = await server.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: credentials,
      });

      // 3️⃣ ASSERT
      // Vérifier que le status est 401 (Unauthorized)
      expect(response.statusCode).toBe(401);
    });
  });
});
