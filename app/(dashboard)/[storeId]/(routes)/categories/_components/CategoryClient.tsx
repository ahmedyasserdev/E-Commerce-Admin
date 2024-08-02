'use client'

import Heading from "@/components/shared/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CategoryColumn, columns } from "./Columns"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { DataTable } from "@/components/shared/DataTable"
import ApiList from "@/components/shared/ApiList"

const CategoryClient = ({data} : {data : CategoryColumn[]} ) => {
    const router = useRouter();
    const params = useParams()

    const onClick = () => {
        router.push(`/${params.storeId}/categories/new`)
    }
  return (
   <>
    <div className  = 'md:flex-between  flex  flex-col md:flex-row max-md:gap-y-4' >
        <Heading  title={`Categories (${data.length})`} description="Manage Categories for your store." />
        <Button  onClick = {onClick} className = "w-auto md:w-fit"  >
            <Plus className = "size-5 mr-4 "  />
                Add New
            </Button>
    </div>
        <Separator />


    <DataTable columns = {columns} data = {data} searchKey = {'name'} />

    <Heading title = "API" description="API Calls for Categories"  />
    <Separator />
    <ApiList entityName="categories" entityIdName="categoryId" />
        </>
  )
}

export default CategoryClient