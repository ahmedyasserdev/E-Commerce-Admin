import React from "react";
import { Metadata } from "next";
import db from "@/lib/db";
import {format} from "date-fns"
import { ColorsColumn } from "./_components/Columns";
import ColorsClient from "./_components/ColorsClient";

export const metadata: Metadata = {
  title: "Colors",
};

const ColorsPage = async ({
  params: { storeId },
}: {
  params: { storeId: string };
}) => {
  const colors = await db.color.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });


  const formattedColors : ColorsColumn[] = colors.map((item) => ({
    id : item.id,
    name  : item.name,
    value : item.value ,
    createdAt : format(item.createdAt, "MMMM do , yyy")
  }))

  return (
    <section className="">
      <div className=" space-y-4 pt-6 ">
        <ColorsClient data={formattedColors} />
      </div>
    </section>
  );
};

export default ColorsPage;
