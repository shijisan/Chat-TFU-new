// app/api/contact/respond/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { randomUUID } from "crypto"

export async function PATCH(req: Request) {
  const session = await auth()
  const { id, action } = await req.json()

  if (!session?.user?.id || !["ACCEPTED", "DECLINED"].includes(action)) {
    return NextResponse.json({ error: "Unauthorized or invalid action" }, { status: 400 })
  }

  const request = await prisma.contactRequest.findUnique({
    where: { id },
  })

  if (!request || request.receiverId !== session.user.id) {
    return NextResponse.json({ error: "Request not found or not yours" }, { status: 403 })
  }

  await prisma.contactRequest.update({
    where: { id },
    data: { status: action },
  })

  if (action === "ACCEPTED") {
    const conversationId = randomUUID()
    const contact = await prisma.contact.create({
      data: {
        userId: request.senderId,
        contactId: request.receiverId,
        conversationId,
      },
    })
    await prisma.contact.create({
      data: {
        userId: request.receiverId,
        contactId: request.senderId,
        conversationId,
      },
    })
    return NextResponse.json({ success: true, newContact: contact })
  }

  return NextResponse.json({ success: true })
}