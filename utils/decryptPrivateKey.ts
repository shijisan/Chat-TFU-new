import crypto from "crypto"

type DecryptArgs = {
  encryptedKey: string,
  encryptedPrivateKey: string,
  iv: string,
  aesKey: Buffer // the same AES key used to encrypt both encryptedKey and privateKey
}

export function decryptPrivateKey({
  encryptedKey,
  encryptedPrivateKey,
  iv,
  aesKey
}: DecryptArgs): string {
  // Convert IV from base64
  const ivBuffer = Buffer.from(iv, "base64")

  // 1. Decrypt the userEncryptionKey
  const keyDecipher = crypto.createDecipheriv("aes-256-cbc", aesKey, ivBuffer)
  let userEncryptionKey = keyDecipher.update(encryptedKey, "base64")
  userEncryptionKey = Buffer.concat([userEncryptionKey, keyDecipher.final()])

  // 2. Use that key to decrypt the private RSA key
  const privateKeyDecipher = crypto.createDecipheriv("aes-256-cbc", userEncryptionKey, ivBuffer)
  let decryptedPrivateKey = privateKeyDecipher.update(encryptedPrivateKey, "base64", "utf8")
  decryptedPrivateKey += privateKeyDecipher.final("utf8")

  return decryptedPrivateKey
}
