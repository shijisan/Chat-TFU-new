"use client"

import { signIn } from "next-auth/react"

export default function AuthPage(){

   return(
      <>
      <main className="flex justify-center items-center min-h-screen">
         <button className="btn bg-blue-500 text-white" onClick={() => signIn("google")} >Sign in with Google</button>
      </main>
      </>
   )
}