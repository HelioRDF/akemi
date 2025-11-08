"use server";

import { ConsumptionMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";


interface CreateOrderInput {
  customerName: string;
  customerCellPhone: string;
  products: Array<{
    id: string;
    quantity: number;
  }>;
  consumptionMethod: ConsumptionMethod;
  slug: string;
}

export const createOrder = async (input: CreateOrderInput) => {
  const comercio = await db.comercio.findUnique({
    where: {
      slug: input.slug,
    },
  });
  if (!comercio) {
    throw new Error("Restaurant not found");
  }
  const productsWithPrices = await db.product.findMany({
    where: {
      id: {
        in: input.products.map((product) => product.id),
      },
    },
  });
  const productsWithPricesAndQuantities = input.products.map((product) => ({
    productId: product.id,
    quantity: product.quantity,
    price: productsWithPrices.find((p) => p.id === product.id)!.price,
  }));
  const order = await db.order.create({
    data: {
      status: "PENDING",
      customerName: input.customerName,
      customerCellPhone: input.customerCellPhone,
      orderProducts: {
        createMany: {
          data: productsWithPricesAndQuantities,
        },
      },
      total: productsWithPricesAndQuantities.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      ),
      consumptionMethod: input.consumptionMethod,
      comercioId: comercio.id,
    },
  });
  revalidatePath(`/${input.slug}/orders`);
  return order;
};
