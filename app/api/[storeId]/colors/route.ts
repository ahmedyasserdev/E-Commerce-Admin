import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {ColorFormSchema} from "@/schemas"
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

       

            const validatedFields = ColorFormSchema.safeParse(body)

      

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
                userId : userId ? userId : undefined
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const color = await db.color.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        });

        revalidatePath(`/${params.storeId}/colors`)

        return NextResponse.json(color);
    } catch (error) {
        console.log('[COLORS_POST]', error);
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

        const colors = await db.color.findMany({
          where : {
            storeId : params.storeId
          }
        });

        return NextResponse.json(colors);
    } catch (error) {
        console.log('[COLORS_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
