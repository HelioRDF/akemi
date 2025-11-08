import { db } from "@/lib/prisma";

import CpfForm from "./components/cpf-form";
import OrderList from "./components/order-list";

interface OrdersPageProps {
  searchParams: Promise<{ cellphone: string }>;
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const { cellphone } = await searchParams;
  if (!cellphone) {
    return <CpfForm />;
  }
  const orders = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      customerCellPhone: cellphone,
    },
    include: {
      comercio: {
        select: {
          name: true,
          avatarImageUrl: true,
        },
      },
      orderProducts: {
        include: {
          product: true,
        },
      },
    },
  });
  return <OrderList orders={orders} />;
};

export default OrdersPage;
