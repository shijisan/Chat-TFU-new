/*
  Warnings:

  - Added the required column `encryptedKey` to the `UserEncryption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserEncryption" ADD COLUMN     "encryptedKey" TEXT NOT NULL;
