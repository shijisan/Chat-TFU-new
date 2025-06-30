"use client"

import { useSession, signOut } from "next-auth/react";

export default function AccountPage() {
   const { data: session, status } = useSession()


   return (
      <>
         <h1>This is the account page</h1>
         <p>{session?.user?.email}</p>
         <p>{session?.user?.name}</p>
         <button className="btn bg-red-500 text-white" onClick={() => signOut()}>Log Out</button>
      </>
   )
}