import React from "react";
import { Metadata } from "next";
import db from "@/lib/db";
import {format} from "date-fns"
import { SizesColumn } from "./_components/Columns";
import SizesClient from "./_components/SizesClient";

export const metadata: Metadata = {
  title: "Sizes",
};

const SizesPage = async ({
  params: { storeId },
}: {
  params: { storeId: string };
}) => {
  const sizes = await db.size.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });


  const formattedSizes : SizesColumn[] = sizes.map((item) => ({
    id : item.id,
    name  : item.name,
    value : item.value ,
    createdAt : format(item.createdAt, "MMMM do , yyy")
  }))

  return (
    <section className="">
      <div className=" space-y-4 pt-6 ">
        <SizesClient data={formattedSizes} />
      </div>
    </section>
  );
};

export default SizesPage;
