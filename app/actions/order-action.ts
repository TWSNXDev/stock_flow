"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export type OrderItemData = {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
};

export type OrderData = {
  id: string;
  status: string;
  totalAmount: number;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemData[];
};

export async function getMyOrders(): Promise<{ orders?: OrderData[]; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, imageUrl: true },
            },
          },
        },
      },
    });

    const serialized: OrderData[] = orders.map((order) => ({
      id: order.id,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      address: order.address,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
        product: {
          id: item.product.id,
          name: item.product.name,
          imageUrl: item.product.imageUrl,
        },
      })),
    }));

    return { orders: serialized };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return { error: "Failed to fetch orders" };
  }
}
