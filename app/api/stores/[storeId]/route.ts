import db from "@/lib/db";
import { SettingsFormSchema } from "@/schemas";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
    try {
        const {userId} = auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });
        const body = await req.json();

        const validatedFields = SettingsFormSchema.safeParse(body);

        if (!validatedFields.success)   return new NextResponse("Missing Required Fields", { status: 400 });

        if (!storeId) return new NextResponse("Missing Store Id", { status: 400 });
        const {name }  = validatedFields.data;

        const store = await db.store.updateMany({
            where : {
                id : storeId,
                userId
            },
            data : {
                name
            }
        })
        revalidatePath(`/${storeId}`)


        return NextResponse.json(store)

    }catch(error) {
        console.log(`[STORE_PATCH]`, error);
        return new NextResponse("Internal Error", { status: 500 });
    } 
} 


export async function DELETE(
    req: Request,
    { params: { storeId } }: { params: { storeId: string } }
  ) {
      try {
          const {userId} = auth();
          if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  
  
          if (!storeId) return new NextResponse("Missing Store Id", { status: 400 });
  
          const store = await db.store.deleteMany({
              where : {
                  id : storeId,
                  userId
              },
          })
  
  
          return NextResponse.json(store)
  
      }catch(error) {
          console.log(`[STORE_PATCH]`, error);
          return new NextResponse("Internal Error", { status: 500 });
      } 
  } 
  