// lib/auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    }),
  ],

  adapter: PrismaAdapter(prisma),
  
  session:{
    strategy: "jwt"
  },

  events: {
    async signIn({ user }) {
      const url = `${process.env.NEXTAUTH_URL}/api/user/encryption`

      if (user.email) {
        const userExists = await prisma.user.findUnique({
          where: { email: user.email },
        })

        if (!userExists) {
          try {
            await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ user: { id: user.id, email: user.email } }),
            })
          } catch (error) {
            console.error("Failed to initialize encryption keys:", error)
          }
        }
      }
    },
  },

  callbacks: {
    async redirect({ baseUrl }) {
      return `${baseUrl}/account`
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      // Add null checks to prevent the error
      if (session?.user && token?.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})