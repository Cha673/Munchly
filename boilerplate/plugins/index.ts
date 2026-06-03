import type { FastifyInstance } from "fastify";
import { prismaPlugin } from "./prisma.js";
import jwtDecorator from "../decorators/jwtDecorator.js";

export const registerPlugins = async (app: FastifyInstance) => {
  await app.register(prismaPlugin);
  await app.register(jwtDecorator);
  await app.register(import("@fastify/websocket"));
  
  // Enregistrement du plugin rate-limit
  await app.register(import("@fastify/rate-limit"), {
    global: false, // On ne l'applique pas à toutes les routes, mais manuellement route par route
  });
};
