import React from "react";
import { Metadata } from "next";
import db from "@/lib/db";
import {format} from "date-fns"
import { OrderColumn } from "./_components/Columns";
import { priceFormatter } from "@/lib/utils";
import OrderClient from "./_components/OrderClient";

export const metadata: Metadata = {
  title: "Orders",
};

const OrdersPage = async ({
  params: { storeId },
}: {
  params: { storeId: string };
}) => {
  const orders = await db.order.findMany({
    where: { storeId },
    include : {
      orderItems : {
        include : {product : true}
      }
    },
    orderBy: { createdAt: "desc" },
  });


  const formattedOrders : OrderColumn[] = orders.map((item) => ({
    id : item.id,
    phone  : item.phone,
    address : item.address,
    isPaid : item.isPaid ,
    products : item.orderItems.map((item) => item.product.name).join(", "),
    totalPrice : priceFormatter(item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price)
    },0)),
    createdAt : format(item.createdAt, "MMMM do , yyy")
  }))

  return (
    <section className="">
      <div className=" space-y-4 pt-6 ">
        <OrderClient data={formattedOrders} />
      </div>
    </section>
  );
};

export default OrdersPage;
