// app/api/contact/list/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id

  const contacts = await prisma.contact.findMany({
    where: { userId },
    include: {
      contact: true,
    },
  })

  const requests = await prisma.contactRequest.findMany({
    where: {
      receiverId: userId,
      status: "PENDING"
    },
    include: {
      sender: true,
    },
  })

  return NextResponse.json({
    contacts: contacts.map(c => ({
      id: c.id,
      name: c.contact.name,
      email: c.contact.email,
      conversationId: c.conversationId,
    })),
    requests: requests.map(r => ({
      id: r.id,
      senderName: r.sender.name,
      senderEmail: r.sender.email,
    }))
  })
}