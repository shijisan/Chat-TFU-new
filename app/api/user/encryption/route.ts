import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  const { user } = await req.json()

  if (!user?.id || !user?.email) {
    return NextResponse.json({ error: "Missing user ID or email" }, { status: 400 })
  }

  const aesKey = crypto.randomBytes(32)
  const iv = crypto.randomBytes(16)
  const salt = crypto.randomBytes(16)

  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  })

  const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv)
  let encryptedPrivateKey = cipher.update(privateKey, "utf8", "base64")
  encryptedPrivateKey += cipher.final("base64")

  const userEncryptionKey = crypto.randomBytes(32)

  const hashedKey = crypto.pbkdf2Sync(userEncryptionKey, salt, 100000, 64, "sha512").toString("base64")

  const keyCipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv)
  let encryptedKey = keyCipher.update(userEncryptionKey, undefined, "base64")
  encryptedKey += keyCipher.final("base64")

  await prisma.userEncryption.create({
    data: {
      userId: user.id,
      iv: iv.toString("base64"),
      salt: salt.toString("base64"),
      publicKey,
      encryptedPrivateKey,
      encryptedKey,
    },
  })

  return NextResponse.json({ success: true })
}
