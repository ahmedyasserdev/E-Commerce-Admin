import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import Navbar from "@/components/shared/Navbar";
const DashboardLayout = async ({
  children,
  params: { storeId },
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");
  const store = await db.store.findFirst({
    where: { id: storeId, userId },
  });

  if (!store) return redirect("/");

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default DashboardLayout;
