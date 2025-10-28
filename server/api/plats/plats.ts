import platsData from "../data/plats.json";
import type { Plat } from "~/types/plats/plats";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const id = query.id ? Number(query.id) : null;

  // Si un ID est fourni, retourner le plat correspondant
  if (id) {
    const plat = platsData.find((p: any) => p.id === id);
    return plat ? [plat] : [];
  }

  // Sinon, retourner tous les plats
  return platsData;
});
