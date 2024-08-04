import db from "@/lib/db";
import { redirect } from "next/navigation";
import React, { cache } from "react";
import { Metadata } from "next";
import ColorForm from "./_components/ColorForm";

export async function generateMetadata({
  params: { colorId },
}: {
  params: { colorId: string };
}): Promise<Metadata> {
  let color = null;
  if (colorId !== "new") {
    color = await db.color.findUnique({ where: { id: colorId } });
  }
  return {
    title: color?.name || "Create color",
  };
}

const getColor = cache(async (colorId: string) => {
  const color = await db.color.findUnique({
    where: {
      id: colorId,
    },
  });
  return color;
});

const ColorPage = async ({
  params: { colorId },
}: {
  params: { colorId: string };
}) => {
  let color = null;
  if (colorId !== "new") {
    color = await getColor(colorId);
  }

  return (
    <section className="pt-6 flex-col">
      <div className="flex-1 space-y-4">
        <ColorForm initialData={color} />
      </div>
    </section>
  );
};

export default ColorPage;
