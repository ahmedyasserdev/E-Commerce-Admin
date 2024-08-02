import db from "@/lib/db";
import { CategoryFormSchema } from "@/schemas";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: { params: { categoryId: string } }
) {
    try {
        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 })
        }

        const category = await db.category.findUnique({
            where: {
                id: params.categoryId,
            },
        });
        
        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORYID_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const validatedFields = CategoryFormSchema.safeParse(body)
   
        if (!validatedFields.success) {
            return new NextResponse("Missing  required Fields ", { status: 400 });
        }

        const { name , billboardId } = validatedFields.data;
        if (!params.categoryId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
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

        const category = await db.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name ,
                billboardId
            }
        });

        revalidatePath(`/${params.storeId}/categories`);
        
        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORYID_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.categoryId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
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

        const category = await db.category.deleteMany({
            where: {
                id: params.categoryId,
            },
        });
        
        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORYID_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}