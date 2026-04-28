import Fastify, { FastifyInstance, FastifyError } from "fastify";
import "../../plugins/dotenvx.js"; // 👈 On charge les variables d'environnement (dont JWT_SECRET) !
import cors from "@fastify/cors";
import { registerPlugins } from "../../plugins/index.js";
import { registerRoutes } from "../../routes/index.js";
import { registerGraphQL } from "../../graphql/index.js";
import { AppError } from "../../common/exceptions.js";

export async function createTestServer(): Promise<FastifyInstance> {
  // On crée une instance Fastify (sans logger pour garder la console propre pendant les tests)
  const server = Fastify({ logger: false });

  // On reproduit la configuration de votre index.ts

  // 1. Gestionnaire d'erreurs global
  server.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      const problemDetail = error.problemDetail;
      problemDetail.instance = request.url;
      return reply.status(error.statusCode).send(problemDetail);
    }

    // Erreurs de validation Fastify
    const validationError = error as FastifyError;
    if (validationError.code === "FST_ERR_VALIDATION") {
      return reply.status(400).send({
        type: "urn:app:error:validation",
        title: "Validation Error",
        status: 400,
        detail: validationError.message,
        instance: request.url,
      });
    }

    return reply.status(500).send({
      type: "urn:app:error:internal",
      title: "Internal Server Error",
      status: 500,
      detail: "An unexpected error occurred",
      instance: request.url,
    });
  });

  // 2. Plugins, GraphQL et Routes
  await server.register(cors, {});
  await registerPlugins(server);
  await registerGraphQL(server);
  await registerRoutes(server);

  // Attendre que tout soit prêt
  await server.ready();

  return server;
}

export async function closeTestServer(server: FastifyInstance) {
  if (server) {
    await server.close();
  }
}
