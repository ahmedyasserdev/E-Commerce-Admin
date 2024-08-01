import db from "@/lib/db";
import React, { cache } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

const getStore = cache(async (storeId: string) => {
  const store = await db.store.findFirst({ where: { id: storeId } });
  return store;
});

export async function generateMetadata({
  params: { storeId },
}: {
  params: { storeId: string };
}): Promise<Metadata> {
  const store = await db.store.findFirst({ where: { id: storeId } ,});
  return {
    title: store?.name,
  };
}

const DashboardPage = async ({
  params: { storeId },
}: {
  params: { storeId: string };
}) => {
  const store = await getStore(storeId);
  if (!store) return redirect("/")

 
  return <div>Active Store : {store?.name}</div>;
};

export default DashboardPage;
