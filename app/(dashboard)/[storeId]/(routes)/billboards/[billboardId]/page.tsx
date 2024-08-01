import db from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'
import BillboardForm from './_components/BillboardForm'
import { Metadata } from 'next';


export async function generateMetadata({
  params: { billboardId },
}: {
  params: { billboardId: string };
}): Promise<Metadata> {
  let billboard = null;
    if (billboardId !== 'new') {
       billboard = await db.billboard.findUnique({ where: { id: billboardId } });
    }
  return {
    title: billboard?.label || "Create Billboard",
  };
}



const BillboardPage = async ({params : {billboardId}} : {params : {billboardId : string}} ) => {
  let billboard = null ;
  if (billboardId !== 'new') {
     billboard = await db.billboard.findUnique({
      where : {
        id : billboardId
      }
    })
  }

  return (
    <section className='pt-6 flex-col'>
        <div className="flex-1 space-y-4">
          <BillboardForm initialData={billboard} />
        </div>

    </section>
  )
}

export default BillboardPage