import * as z from "zod"


export const CreateStoreSchema = z.object({
    name : z.string().min(1)
})


export const SettingsFormSchema = z.object({
    name : z.string().min(1)
})


export const BillboardFormSchema = z.object({
    label : z.string().min(1),
    imageUrl : z.string().min(1) 
})
export const CategoryFormSchema = z.object({
    name  : z.string().min(1),
    billboardId :  z.string().min(1)
})
export const SizeFormSchema = z.object({
    name  : z.string().min(1),
    value :  z.string().min(1)
})
export const ColorFormSchema = z.object({
    name  : z.string().min(1),
    value :  z.string().min(1)
})