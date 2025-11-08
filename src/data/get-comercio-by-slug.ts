import { db } from "@/lib/prisma";

export const getComercioBySlug = async (slug: string) => {
  const comercio = await db.comercio.findUnique({ where: { slug: slug } });
  return comercio;
};
