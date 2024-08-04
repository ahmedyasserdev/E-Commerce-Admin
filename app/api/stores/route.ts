import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server" 
import db from '@/lib/db';
import { revalidatePath } from "next/cache";
export async function POST (req : Request) {
    try {
        const {userId} = auth();
        const body = await req.json();

        const {name }  = body
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    
            if (!name ) return new NextResponse("Name is required", { status: 400 });
    
            const store = await db.store.create({
                    data : {
                        name ,
                        userId
                    }
            })

        revalidatePath(`/${store.id}`)

    
            return NextResponse.json(store)
    }catch (error) {
        console.log(`[STORES_POST]`, error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}