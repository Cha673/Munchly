import { FastifyInstance } from "fastify/types/instance";
import UsersService from "../../services/users.service.js";
import {
  UpdateUserSchema,
  type UpdateUserRequest,
} from "../../schemas/user.schema.js";
import { ErrorResponseSchema } from "../../schemas/error.schema.js";
import { NotFoundError } from "../../common/exceptions.js";

// Les routes concernant le gestion de profil utilisateur (Users)
export const usersRoutes = async (app: FastifyInstance) => {
  const usersService = new UsersService(app.prisma);

  // 1. Récupérer le profil connecté (GET /users/me)
  app.get(
    "/me",
    {
      onRequest: [app.authenticate],
    },
    async (request, reply) => {
      // request.user.id est extrait de l'AccessToken (JWT) envoyé dans le header
      const user = await app.prisma.user.findUnique({
        where: { id: request.user.id },
      });

      if (!user) throw new NotFoundError("Utilisateur non trouvé");

      // On retire le hash du mot de passe avant d'envoyer la réponse
      const { password, ...safeUser } = user;
      return reply.send(safeUser);
    },
  );

  // 2. Modifier le profil (PATCH /users/me)
  // Le verbe PATCH est plus approprié que PUT car il s'agit d'une mise à jour partielle.
  app.patch<{ Body: UpdateUserRequest }>(
    "/me",
    {
      schema: {
        body: UpdateUserSchema,
        response: {
          409: ErrorResponseSchema, // Si l'email est déjà pris !
          404: ErrorResponseSchema,
        },
      },
      // Le fait de récupérer l'ID depuis app.authenticate (request.user.id) et non depuis les paramètres (/:id)
      // oblige l'utilisateur à modifier SON propre compte, il n'a pas accès à l'ID des autres.
      onRequest: [app.authenticate],
    },
    async (request, reply) => {
      // Appel du service pour valider (unicité de l'email) et appliquer l'update
      const updatedUser = await usersService.updateUser(
        request.user.id,
        request.body,
      );
      return reply.send(updatedUser);
    },
  );

  // 3. Supprimer le compte (DELETE /users/me)
  app.delete(
    "/me",
    {
      onRequest: [app.authenticate],
    },
    async (request, reply) => {
      await usersService.deleteUser(request.user.id);
      return reply.send({ message: "Compte supprimé avec succès" });
    },
  );
};
