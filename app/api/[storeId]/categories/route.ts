import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CategoryFormSchema} from "@/schemas"
import db from "@/lib/db";

export async function POST(
    req: Request,
    { params }: { params: {  storeId : string   } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

       

            const validatedFields = CategoryFormSchema.safeParse(body)

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!validatedFields.success) {
            return new NextResponse("Missing  required Fields ", { status: 400 });
        }

        
        const {name , billboardId} = validatedFields.data

        

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

        const category = await db.category.create({
            data: {
                name ,
                billboardId ,
                storeId : params.storeId
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORIES_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function GET(
    req: Request,
    { params }: { params: { storeId : string  ; } }
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

        const category = await db.category.findMany({
          where : {
            storeId : params.storeId
        }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
