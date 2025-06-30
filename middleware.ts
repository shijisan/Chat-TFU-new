import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const protectedPaths = ["/account", "/messenger"]
  const { pathname } = req.nextUrl

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtected) {
    // Try multiple approaches to get the token
    let token = null
    
    // First try with authjs cookie name (newer versions)
    try {
      token = await getToken({ 
        req, 
        secret: process.env.AUTH_SECRET,
        cookieName: "authjs.session-token"
      })
    } catch (error) {
      console.log("Failed to get token with authjs cookie name:", error)
    }
    
    // If that fails, try with next-auth cookie name (older versions)
    if (!token) {
      try {
        token = await getToken({ 
          req, 
          secret: process.env.AUTH_SECRET,
          cookieName: "next-auth.session-token"
        })
      } catch (error) {
        console.log("Failed to get token with next-auth cookie name:", error)
      }
    }
    
    // If still no token, try default configuration
    if (!token) {
      try {
        token = await getToken({ 
          req, 
          secret: process.env.AUTH_SECRET
        })
      } catch (error) {
        console.log("Failed to get token with default config:", error)
      }
    }

    console.log("Middleware - pathname:", pathname)
    console.log("Middleware - token exists:", !!token)
    
    if (!token) {
      console.log("No valid token found, redirecting to auth")
      const loginUrl = new URL("/auth", req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/account/:path*", "/messenger/:path*"],
}