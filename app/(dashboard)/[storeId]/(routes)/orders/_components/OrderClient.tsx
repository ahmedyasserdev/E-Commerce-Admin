'use client'

import Heading from "@/components/shared/Heading"
import { Separator } from "@/components/ui/separator"
import { OrderColumn, columns } from "./Columns"
import { useParams, useRouter } from "next/navigation"
import { DataTable } from "@/components/shared/DataTable"

const OrderClient = ({data} : {data : OrderColumn[]} ) => {
   
  return (
   <>
        <Heading  title={`Billboards (${data.length})`} description="Manage billboards for your store." />
        <Separator />
        <DataTable columns={columns} data={data} searchKey="label" />
        </>
  )
}

export default OrderClient