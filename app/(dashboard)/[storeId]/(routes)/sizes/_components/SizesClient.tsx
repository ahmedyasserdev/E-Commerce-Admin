'use client'

import Heading from "@/components/shared/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SizesColumn, columns } from "./Columns"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { DataTable } from "@/components/shared/DataTable"
import ApiList from "@/components/shared/ApiList"

const SizesClient = ({data} : {data : SizesColumn[]} ) => {
    const router = useRouter();
    const params = useParams()

    const onClick = () => {
        router.push(`/${params.storeId}/sizes/new`)
    }
  return (
   <>
    <div className  = 'md:flex-between  flex  flex-col md:flex-row max-md:gap-y-4' >
        <Heading  title={`Sizes (${data.length})`} description="Manage sizes for your store." />
        <Button  onClick = {onClick} className = "w-auto md:w-fit"  >
            <Plus className = "size-5 mr-4 "  />
                Add New
            </Button>
    </div>
        <Separator />


        <DataTable columns={columns} data={data} searchKey="name" />
            <Heading
                title="API"
                description="API calls for sizes"
            />
            <Separator />
            <ApiList entityName="sizes" entityIdName="sizeId" />
        </>
  )
}

export default SizesClient