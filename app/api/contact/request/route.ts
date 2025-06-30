// app/api/contact/request/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  const { email } = await req.json()

  console.log("session:", session)
  console.log("email requested:", email)

  if (!session?.user?.id || !email) {
    return NextResponse.json({ error: "Unauthorized or invalid email" }, { status: 400 })
  }

  const senderId = session.user.id
  const receiver = await prisma.user.findUnique({ where: { email } })
  if (!receiver) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (receiver.id === senderId) {
    return NextResponse.json({ error: "You cannot request yourself" }, { status: 400 })
  }

  const exists = await prisma.contactRequest.findFirst({
    where: {
      senderId,
      receiverId: receiver.id,
      status: "PENDING"
    }
  })

  if (exists) {
    return NextResponse.json({ error: "Request already sent" }, { status: 409 })
  }

  await prisma.contactRequest.create({
    data: {
      senderId,
      receiverId: receiver.id,
    }
  })

  return NextResponse.json({ success: true })
}