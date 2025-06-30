import crypto from "crypto";

export function encryptMessage(message: string, recipientPublicKeyPem: string, senderPrivateKeyPem: string) {
  // 1. Generate AES key and IV
  const aesKey = crypto.randomBytes(32)
  const iv = crypto.randomBytes(16)

  // 2. Encrypt the message with AES
  const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv)
  let encryptedMessage = cipher.update(message, "utf8", "base64")
  encryptedMessage += cipher.final("base64")

  // 3. Encrypt AES key with recipient's public key
  const encryptedAesKey = crypto.publicEncrypt(recipientPublicKeyPem, aesKey).toString("base64")

  // 4. Sign the **original message** with sender's private key
  const signature = crypto.sign("sha256", Buffer.from(message), {
    key: senderPrivateKeyPem,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
  }).toString("base64")

  return {
    encryptedMessage,
    encryptedAesKey,
    iv: iv.toString("base64"),
    signature,
  }
}

export function decryptMessage({
  encryptedMessage,
  encryptedAesKey,
  iv,
  signature,
}: {
  encryptedMessage: string,
  encryptedAesKey: string,
  iv: string,
  signature: string,
}, recipientPrivateKeyPem: string, senderPublicKeyPem: string): string {
  // 1. Decrypt AES key
  const aesKey = crypto.privateDecrypt(
    recipientPrivateKeyPem,
    Buffer.from(encryptedAesKey, "base64")
  )

  // 2. Decrypt message
  const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, Buffer.from(iv, "base64"))
  let decryptedMessage = decipher.update(encryptedMessage, "base64", "utf8")
  decryptedMessage += decipher.final("utf8")

  // 3. Verify the signature
  const isVerified = crypto.verify(
    "sha256",
    Buffer.from(decryptedMessage),
    {
      key: senderPublicKeyPem,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    },
    Buffer.from(signature, "base64")
  )

  if (!isVerified) throw new Error("Signature verification failed!")

  return decryptedMessage
}
