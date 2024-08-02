import db from '@/lib/db'
import { redirect } from 'next/navigation'
import React, { cache } from 'react'
import CategoryForm from './_components/CategoryForm'
import { Metadata } from 'next';


export async function generateMetadata({
  params: { categoryId },
}: {
  params: { categoryId: string };
}): Promise<Metadata> {
  let category = null;
    if (categoryId !== 'new') {
       category = await db.category.findUnique({ where: { id: categoryId } });
    }
  return {
    title: category?.name || "Create category",
  };
}

const getCategory = cache(async (categoryId: string) => {
 const category =  await db.category.findUnique({
    where : {
      id : categoryId
    },
  
  });
  return category
})

const CategoryPage = async ({params : {categoryId , storeId}} : {params : {categoryId : string , storeId : string}} ) => {
  let category = null ;
  if (categoryId !== 'new') {
     category = await getCategory(categoryId)
  }

  const billboards = await db.billboard.findMany({
    where : {
      storeId 
    }
  })

  return (
    <section className='pt-6 flex-col'>
        <div className="flex-1 space-y-4">
          <CategoryForm  billboards = {billboards} initialData={category} />
        </div>

    </section>
  )
}

export default CategoryPage