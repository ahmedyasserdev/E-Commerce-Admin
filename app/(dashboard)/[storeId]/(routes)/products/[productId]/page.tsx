import db from "@/lib/db";
import { redirect } from "next/navigation";
import React, { cache } from "react";
import { Metadata } from "next";
import ProductForm from "./_components/ProductForm";

export async function generateMetadata({
  params: { productId },
}: {
  params: { productId: string };
}): Promise<Metadata> {
  let product = null;
  if (productId !== "new") {
    product = await db.product.findUnique({ 
      where: {
         id: productId 
        },
       
      
      });
  }
  return {
    title: product?.name || "Create Product",
  };
}

const getProduct = cache(async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    include : {
      images : true,
    }
  });
  return product;
});

const ProductPage = async ({
  params: {  storeId ,  productId },
}: {
  params: { storeId : string; productId: string };
}) => {
  let product = null;
  if (productId !== "new") {
    product = await getProduct(productId);
  }


  const categories = await db.category.findMany({
    where : {
      storeId
    }
  });
  const sizes = await db.size.findMany({
    where : {
      storeId
    }
  });

  const colors = await db.color.findMany({
    where : {
      storeId
    }
  });








  return (
    <section className="pt-6 flex-col">
      <div className="flex-1 space-y-4">
        <ProductForm colors = {colors} sizes = {sizes} categories = {categories} initialData={product} />
      </div>
    </section>
  );
};

export default ProductPage;
