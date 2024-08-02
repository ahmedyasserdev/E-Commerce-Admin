import React from "react";
import CategoryClient from "./_components/CategoryClient";
import { Metadata } from "next";
import db from "@/lib/db";
import {format} from "date-fns"
import { CategoryColumn } from "./_components/Columns";


export const metadata: Metadata = {
  title: "Categories",
};

const CategoriesPage = async ({
  params: { storeId },
}: {
  params: { storeId: string };
}) => {
  const categories = await db.category.findMany({
    where: { storeId },
      include : {billboard  : true}  , 
    orderBy: { createdAt: "desc" },

  });


  const formattedCategories  : CategoryColumn[]  = categories.map((item) => ({
    id : item.id,
    name  : item.name,
    billboardLabel : item.billboard.label,
    createdAt : format(item.createdAt, "MMMM do , yyy")
  }))

  return (
    <section >
      <div className="space-y-4 pt-6">
        <CategoryClient  data={formattedCategories} />
      </div>
    </section>
  );
};

export default CategoriesPage;
