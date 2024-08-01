import React from "react";
import BillboardClient from "./_components/BillboardClient";
import { Metadata } from "next";
import db from "@/lib/db";
import {format} from "date-fns"
import { BillboardColumn } from "./_components/Columns";

export const metadata: Metadata = {
  title: "Billboard",
};

const BillboardsPage = async ({
  params: { storeId },
}: {
  params: { storeId: string };
}) => {
  const billboards = await db.billboard.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });


  const formattedBillboards : BillboardColumn[] = billboards.map((item) => ({
    id : item.id,
    label  : item.label,
    createdAt : format(item.createdAt, "MMMM do , yyy")
  }))

  return (
    <section className="flex-col">
      <div className="flex-1 space-y-4 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </section>
  );
};

export default BillboardsPage;
