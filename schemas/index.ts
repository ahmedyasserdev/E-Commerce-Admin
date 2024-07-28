import * as z from "zod"


export const CreateStoreSchema = z.object({
    name : z.string().min(1)
})