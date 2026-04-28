import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { UnauthorizedError, ForbiddenError } from "../common/exceptions.js";

export default fp(async function (fastify: FastifyInstance, options = {}) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  await fastify.register(fastifyJwt, {
    secret: jwtSecret,
  });

  fastify.decorate(
    "authenticate",
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        // verification du token
        await req.jwtVerify();

        // extraction des infos du token et recuperation de l'utilisateur correspondant dans la base de données
        const decoded = req.user as { id: string };
        const user = await fastify.prisma.user.findUnique({
          where: { id: decoded.id },
        });

        // Throw une erreur si jamais le user n'est pas trouvé
        if (!user) {
          throw new UnauthorizedError();
        }

        // Attacher l'utilisateur à la requete pour les prochaines middlewares ou handlers
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      } catch (err) {
        throw new UnauthorizedError();
      }
    },
  );

  fastify.decorate("authorize", (allowedRoles: string[]) => {
    return async (req: FastifyRequest, res: FastifyReply) => {
      // authentification de l'utilisateur
      await fastify.authenticate(req, res);

      // Vérification que req.user.role est dans allowedRoles
      const user = req.user as { id: string; email: string; role: string };
      if (!allowedRoles.includes(user.role)) {
        throw new ForbiddenError("Accès refusé : rôle insuffisant");
      }
    };
  });
});
