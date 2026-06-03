import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import "./plugins/dotenvx.js";
import swagger from "@fastify/swagger";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { registerPlugins } from "./plugins/index.js";
import { registerRoutes } from "./routes/index.js";
import { registerGraphQL } from "./graphql/index.js";
import { AppError } from "./common/exceptions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = fastify({
  logger: true,
});

// Gestionnaire d'erreurs global (RFC 7807)
server.setErrorHandler((error, request, reply) => {
  // Enregistrer l'erreur complète côté serveur pour le debugging
  server.log.error({
    err: error,
    url: request.url,
    method: request.method,
  });

  // AppError: utiliser le format RFC 7807
  if (error instanceof AppError) {
    const problemDetail = error.problemDetail;
    problemDetail.instance = request.url;
    return reply.status(error.statusCode).send(problemDetail);
  }

  // Erreurs de validation Fastify
  const fastifyError = error as FastifyError;
  if (fastifyError.code === "FST_ERR_VALIDATION") {
    return reply.status(400).send({
      type: "urn:app:error:validation",
      title: "Validation Error",
      status: 400,
      detail: fastifyError.message,
      instance: request.url,
    });
  }

  if (fastifyError.statusCode === 429) {
    return reply.status(429).send({
      type: "urn:app:error:rate-limit",
      title: "Too Many Requests",
      status: 429,
      detail: "error.rate_limit",
      instance: request.url,
    });
  }

  reply.status(500).send({
    type: "urn:app:error:internal",
    title: "Internal Server Error",
    status: 500,
    detail: "An unexpected error occurred",
    instance: request.url,
  });
});

server.get("/health", async () => {
  return { status: "ok" };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    const host = "0.0.0.0";

    await server.register(cors, {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });
    if (process.env.NODE_ENV === "development") {
      await server.register(swagger, {
        openapi: {
          info: {
            title: "API",
            description: "API documentation",
            version: "1.0.0",
          },
          components: {
            securitySchemes: {
              bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
              },
            },
          },
        },
      });

      await server.register(import("@fastify/swagger-ui"), {
        routePrefix: "/docs",
        uiConfig: {
          docExpansion: "full",
          deepLinking: false,
        },
      });
    }

    await registerPlugins(server);
    await registerGraphQL(server);
    await registerRoutes(server);

    await server.ready();
    // if (process.env.NODE_ENV === "development") {
    //   server.swagger();
    // }

    await server.listen({ port, host });
    server.log.info(`Server running on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
