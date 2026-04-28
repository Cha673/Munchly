import type { PrismaClient } from "../generated/prisma/client.js";
import { hash, compare } from "bcryptjs";
import { ConflictError, UnauthorizedError } from "../common/exceptions.js";
import { Type } from "@sinclair/typebox";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  role: string;
}

export default class AuthService {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  registerRestaurant = async (input: RegisterInput): Promise<AuthResponse> => {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    const hashedPassword = await hash(input.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        role: "RESTAURANT",
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
  };

  registerAdmin = async (input: RegisterInput): Promise<AuthResponse> => {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    const hashedPassword = await hash(input.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
  };

  register = async (input: RegisterInput): Promise<AuthResponse> => {
    //1. recuperer l'utilisateur avec l'email en base de données
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    //2. si l'utilisateur existe déjà, throw une erreur de conflit
    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    //3. hasher le mot de passe avec la fonction hash (nombre de rounds recommandé : 10)
    const hashedPassword = await hash(input.password, 10);

    //4. créer l'utilisateur en base de données avec le mdp hashé

    const newUser = await this.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
      },
    });
    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
  };

  login = async (input: LoginInput): Promise<AuthResponse> => {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isPasswordValid = await compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  };
}
