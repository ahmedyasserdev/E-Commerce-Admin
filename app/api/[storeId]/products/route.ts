import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ProductFormSchema } from "@/schemas";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const validatedFields = ProductFormSchema.safeParse(body);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!validatedFields.success) {
      return new NextResponse("Missing  required Fields ", { status: 400 });
    }

    const {
      categoryId,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
      images,
      name,
      price,
    } = validatedFields.data;

    if (!images || !images.length) {
        return new NextResponse("Images are required" , {status : 400})
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await db.product.create({
      data: {
        categoryId,
        colorId,
        storeId : params.storeId,
        sizeId,
        isFeatured,
        isArchived,
        name,
        price,
        images : {
            createMany : {
                data : [
                ...images.map((image)=> image)
     
                ]
            }
        }
      },
    });

    revalidatePath(`/${params.storeId}/products`);

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const {searchParams} = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined ;
    const colorId = searchParams.get("colorId") || undefined ;
    const sizeId = searchParams.get("sizeId") || undefined ;
    const isfeatured = searchParams.get("isfeatured") || undefined ;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }
    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured : isfeatured ? true : undefined,
        isArchived : false
      },
      include : {
        images : true ,
        category : true ,
        size : true ,
        color : true ,
      },
      orderBy : {createdAt : "desc"}
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
