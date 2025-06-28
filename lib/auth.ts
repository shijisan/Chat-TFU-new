import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google({
     clientId: process.env.CLIENT_ID!,
     clientSecret: process.env.CLIENT_SECRET!,
  })],

  events: {
    async signIn({ user }) {
      const url = `${process.env.NEXTAUTH_URL}/api/user/encryption`

      try {
        await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user }),
        })
      } catch (error) {
        console.error("Failed to initialize encryption keys:", error)
      }
    },
  },

  callbacks: {
    async redirect({ baseUrl }) {
      return `${baseUrl}/account`
    },
  },
})
