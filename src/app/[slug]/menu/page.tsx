import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import RestaurantCategories from "./components/categories";
import RestaurantHeader from "./components/header";

interface ComercioMenuPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ consumptionMethod: string }>;
}
const ComercioMenuPage = async ({
  params,
  searchParams,
}: ComercioMenuPageProps) => {
  const { slug } = await params;
  const comercio = await db.comercio.findUnique({
    where: { slug },
    include: {
      menuCategory: {
        include: { product: true },
      },
    },
  });
  const {} = await searchParams;
  if (!comercio) {
    return notFound();
  }

  return (
    <div>
      <RestaurantHeader comercio={comercio}></RestaurantHeader>
      <RestaurantCategories comercio={comercio}></RestaurantCategories>
    </div>
  );
};

export default ComercioMenuPage;
