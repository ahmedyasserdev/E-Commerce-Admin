import { UserButton } from '@clerk/nextjs'
import React from 'react'
import MainNav from './MainNav'
import StoreSwitcher from './StoreSwitcher'
import db from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const Navbar = async() => {
  const {userId} = auth();
  if (!userId) return redirect("/sign-in")
  const stores = await db.store.findMany({where : {userId}})
  return (
    <div className='border-b '>
        <div className=" h-16 flex items-center ">
            <div>
              <StoreSwitcher items = {stores} />
            </div>
            <MainNav />

            <div className = "flex ml-auto space-x-4 items-center" >
                <UserButton />
            </div>

        </div>
    </div>
  )
}

export default Navbar