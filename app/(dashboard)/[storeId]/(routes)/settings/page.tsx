import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import SettingsForm from './_components/SettingsForm';
import { Metadata } from 'next';

export const metadata : Metadata = {
    title : "Settings"
}
const SettingsPage = async({params : {storeId}} : {params : {storeId : string}}) => {
    const {userId} = auth();
    if (!userId) return redirect("/sign-in");

    const store = await db.store.findFirst({
        where : {
            id  : storeId,
            userId ,
        }
    })

    if (!store) return redirect("/");
  return (
    <section className = "flex-col">
        <div className="flex-1 space-y-4 pt-6">
            <SettingsForm initialData = {store} />
        </div>
    </section>
  )
}

export default SettingsPage