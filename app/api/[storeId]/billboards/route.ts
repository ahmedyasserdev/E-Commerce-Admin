import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {BillboardFormSchema} from "@/schemas"
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

       

            const validatedFields = BillboardFormSchema.safeParse(body)

       

        if (!validatedFields.success) {
            return new NextResponse("Missing  required Fields ", { status: 400 });
        }

        
        const {label , imageUrl} = validatedFields.data

        

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId : userId ? userId : undefined

            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const billboard = await db.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        });

        revalidatePath(`/${params.storeId}/billboards`)

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARDS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();

     

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }
        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId : userId ? userId : undefined

            }
        })
        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const billboards = await db.billboard.findMany({
          where : {
            storeId : params.storeId
          }
        });

        return NextResponse.json(billboards);
    } catch (error) {
        console.log('[BILLBOARDS_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
