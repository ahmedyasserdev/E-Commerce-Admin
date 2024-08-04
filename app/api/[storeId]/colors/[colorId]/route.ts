import db from "@/lib/db";
import { ColorFormSchema } from "@/schemas";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: { params: { colorId: string } }
) {
    try {
        if (!params.colorId) {
            return new NextResponse("color ID is required", { status: 400 })
        }

        const color = await db.color.findUnique({
            where: {
                id: params.colorId,
            },
        });
        
        return NextResponse.json(color);
    } catch (error) {
        console.log('[COLOR_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string, colorId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const validatedFields = ColorFormSchema.safeParse(body)
   
        if (!validatedFields.success) {
            return new NextResponse("Missing required Fields ", { status: 400 });
        }

        const { name, value } = validatedFields.data;
        if (!params.colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
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

        const color = await db.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        });

        revalidatePath(`/${params.storeId}/colors`);
        
        return NextResponse.json(color);
    } catch (error) {
        console.log('[COLORID_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string, colorId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
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

        const color = await db.color.deleteMany({
            where: {
                id: params.colorId,
            },
        });
        
        return NextResponse.json(color);
    } catch (error) {
        console.log('[COLOR_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}