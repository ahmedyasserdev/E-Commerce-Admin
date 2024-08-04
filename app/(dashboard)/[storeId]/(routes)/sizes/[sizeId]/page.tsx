import db from "@/lib/db";
import { redirect } from "next/navigation";
import React, { cache } from "react";
import { Metadata } from "next";
import SizeForm from "./_components/SizeForm";

export async function generateMetadata({
  params: { sizeId },
}: {
  params: { sizeId: string };
}): Promise<Metadata> {
  let size = null;
  if (sizeId !== "new") {
    size = await db.size.findUnique({ where: { id: sizeId } });
  }
  return {
    title: size?.name || "Create Size",
  };
}

const getSize = cache(async (sizeId: string) => {
  const size = await db.size.findUnique({
    where: {
      id: sizeId,
    },
  });
  return size;
});

const SizePage = async ({
  params: { sizeId },
}: {
  params: { sizeId: string };
}) => {
  let size = null;
  if (sizeId !== "new") {
    size = await getSize(sizeId);
  }

  return (
    <section className="pt-6 flex-col">
      <div className="flex-1 space-y-4">
        <SizeForm initialData={size} />
      </div>
    </section>
  );
};

export default SizePage;
