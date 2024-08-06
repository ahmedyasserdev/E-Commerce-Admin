import React from "react";
import { Metadata } from "next";
import db from "@/lib/db";
import {format} from "date-fns"
import { ProductColumn } from "./_components/Columns";
import { priceFormatter } from "@/lib/utils";
import ProductClient from "./_components/ProductClient";

export const metadata: Metadata = {
  title: "Products",
};

const ProudctsPage = async ({
  params: { storeId },
}: {
  params: { storeId: string };
}) => {
  const products = await db.product.findMany({
    where: { storeId },
    include : {
      category : true, 
      size : true ,
      color : true ,
    },
    orderBy: { createdAt: "desc" },
  });


  const formattedProducts : ProductColumn[]  = products.map((item) => ({
    id : item.id,
    name  : item.name,
    isFeatured : item.isFeatured ,
    isArchived : item.isArchived,
    price : priceFormatter(item.price) ,
    category : item.category.name ,
    size : item.size.name,
    color : item.color.value,
    createdAt : format(item.createdAt, "MMMM do , yyy")
  }))

  return (
    <section className="">
      <div className=" space-y-4 pt-6 ">
        <ProductClient data={formattedProducts} />
      </div>
    </section>
  );
};

export default ProudctsPage;
