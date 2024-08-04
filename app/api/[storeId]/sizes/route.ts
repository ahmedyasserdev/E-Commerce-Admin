import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {SizeFormSchema} from "@/schemas"
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

       

            const validatedFields = SizeFormSchema.safeParse(body)

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!validatedFields.success) {
            return new NextResponse("Missing  required Fields ", { status: 400 });
        }

        
        const {name , value} = validatedFields.data

        

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const size = await db.size.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        });
        revalidatePath(`/${params.storeId}/sizes`)

        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZES_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }
        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const sizes = await db.size.findMany({
          where : {
            storeId : params.storeId
          }
        });


        return NextResponse.json(sizes);
    } catch (error) {
        console.log('[SIZES_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
