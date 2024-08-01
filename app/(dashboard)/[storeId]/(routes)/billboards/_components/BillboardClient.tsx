'use client'

import Heading from "@/components/shared/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BillboardColumn, columns } from "./Columns"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { DataTable } from "@/components/shared/DataTable"

const BillboardClient = ({data} : {data : BillboardColumn[]} ) => {
    const router = useRouter();
    const params = useParams()

    const onClick = () => {
        router.push(`/${params.storeId}/billboards/new`)
    }
  return (
   <>
    <div className  = 'md:flex-between  flex  flex-col md:flex-row max-md:gap-y-4' >
        <Heading  title={`Billboards (${data.length})`} description="Manage billboards for your store." />
        <Button  onClick = {onClick} className = "w-auto md:w-fit"  >
            <Plus className = "size-5 mr-4 "  />
                Add New
            </Button>
    </div>
        <Separator />


    <DataTable columns = {columns} data = {data} searchKey = {'label'} />

        </>
  )
}

export default BillboardClient