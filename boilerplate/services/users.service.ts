import { PrismaClient } from "../generated/prisma/client.js";
import { hash } from "bcryptjs";
import { ConflictError, NotFoundError } from "../common/exceptions.js";
import type { UpdateUserRequest } from "../schemas/user.schema.js";

export default class UsersService {
  constructor(private prisma: PrismaClient) {}

  async updateUser(userId: string, data: UpdateUserRequest) {
    // 1. Vérifier que l'utilisateur existe bien
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("Utilisateur introuvable");

    const updateData: any = {};

    // 2. Gérer l'email : on vérifie d'abord que le nouvel email n'est pas déjà pris
    if (data.email && data.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser)
        throw new ConflictError(
          "Cet email est déjà utilisé par un autre compte",
        );
      updateData.email = data.email;
    }

    // 3. Gérer le mot de passe : s'il est fourni, on le hache
    if (data.password) {
      updateData.password = await hash(data.password, 10);
    }

    // 4. Mettre à jour l'utilisateur en base de données
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // 5. Ne jamais renvoyer le mot de passe (même haché) au client
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(userId: string) {
    // Supprimer l'utilisateur selon son ID
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return { success: true };
  }
}
