// API Route complète pour la gestion des plats (CRUD)
//  Méthodes supportées :
//   - GET    : Récupération des plats avec filtres
//   - POST   : Création d'un nouveau plat
//   - PUT    : Mise à jour d'un plat existant
//   - DELETE : Suppression d'un plat

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Plat } from "~/types/plats/plats";

const FILE_PATH = join(process.cwd(), "server/api/data/plats.json");

const readPlats = (): Plat[] => JSON.parse(readFileSync(FILE_PATH, "utf-8"));

const writePlats = (plats: Plat[]) =>
  writeFileSync(FILE_PATH, JSON.stringify(plats, null, 2));

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === "GET") {
    const query = getQuery(event);
    const id = query.id ? Number(query.id) : null;
    const restaurantId = Number(query.restaurantId);
    const search = (query.search as string)?.toLowerCase() || "";

    let plats = readPlats();

    // Filtrer par ID de plat (nouvelle fonctionnalité)
    if (id && !isNaN(id)) {
      const plat = plats.find((p) => p.id === id);
      return plat ? [plat] : [];
    }

    // Filtrer par restaurant
    if (!isNaN(restaurantId)) {
      plats = plats.filter((p) => p.restaurantId === restaurantId);
    }

    // Filtrer par recherche
    if (search) {
      plats = plats.filter(
        (p) =>
          p.nom.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      );
    }

    return plats;
  }

  if (method === "POST") {
    const newPlat = await readBody<Plat>(event);
    const plats = readPlats();
    newPlat.id = Date.now(); // simple ID
    plats.push(newPlat);
    writePlats(plats);
    return newPlat;
  }

  if (method === "PUT") {
    const updatedPlat = await readBody<Plat>(event);
    const plats = readPlats().map((p) =>
      p.id === updatedPlat.id ? updatedPlat : p
    );
    writePlats(plats);
    return updatedPlat;
  }

  if (method === "DELETE") {
    const query = getQuery(event);
    const id = Number(query.id);
    const plats = readPlats().filter((p) => p.id !== id);
    writePlats(plats);
    return { success: true };
  }

  return { error: "Méthode non supportée" };
});
