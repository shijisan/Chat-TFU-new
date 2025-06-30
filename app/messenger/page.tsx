"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"
import { FaUser } from "react-icons/fa6"
import { encryptMessage } from "@/utils/messageCrypto"
import { useSession } from "next-auth/react"

type EncryptedMessage = {
    id: string
    senderId: string
    receiverId: string
    encryptedMessage: string
    encryptedAesKey: string
    iv: string
    signature: string
    sentAt: string
}

export default function Messenger() {
    const { data: session, status } = useSession()
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<{ id: string; text: string }[]>([])
    const userId = session?.user?.id // 🔐 Your auth user ID
    const recipientId = "their-user-id" // 🔐 Who you're chatting with

    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy("sentAt", "asc"))
        const unsub = onSnapshot(q, async (snapshot) => {
            const decrypted: { id: string; text: string }[] = []

            for (const doc of snapshot.docs) {
                const msg = doc.data() as EncryptedMessage
                if (
                    (msg.senderId === userId && msg.receiverId === recipientId) ||
                    (msg.senderId === recipientId && msg.receiverId === userId)
                ) {
                    try {
                        const res = await fetch("/api/messages/decrypt", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                ...msg,
                                senderId: msg.senderId,
                            }),
                        })

                        const json = await res.json()
                        decrypted.push({
                            id: doc.id,
                            text: json.message || "[decryption failed]",
                        })
                    } catch {
                        decrypted.push({ id: doc.id, text: "[error decrypting]" })
                    }
                }
            }

            setMessages(decrypted)
        })

        return () => unsub()
    }, [])

    async function sendMessage(e: React.FormEvent) {
        e.preventDefault()
        if (!input.trim()) return

        const senderPrivateKey = "..." // 🔐 Decrypted or stored private key
        const recipientPublicKey = "..." // 🪪 Their stored public key

        const encrypted = encryptMessage(input, recipientPublicKey, senderPrivateKey)

        await addDoc(collection(db, "messages"), {
            senderId: userId,
            receiverId: recipientId,
            encryptedMessage: encrypted.encryptedMessage,
            encryptedAesKey: encrypted.encryptedAesKey,
            iv: encrypted.iv,
            signature: encrypted.signature,
            sentAt: new Date().toISOString(),
        })

        setInput("")
    }

    return (
        <main className="w-3/6 flex flex-col relative bg-neutral-900/50">
            <div className="flex h-[10vh] gap-6 bg-secondary/10 backdrop-blur-sm sticky top-0 left-0 items-center px-8 border-b border-neutral-600">
                <div className="rounded-full border border-foreground size-8 flex items-center justify-center bg-foreground/10">
                    <FaUser />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-sm">Contact Name</h1>
                    <h1 className="text-xs text-neutral-400">Active status?</h1>
                </div>
            </div>

            <div className="flex flex-col size-full px-8 py-4">
                <div className="flex flex-col size-full grow space-y-2 overflow-y-auto pb-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className="bg-neutral-700 p-2 rounded text-sm text-white max-w-xs">
                            {msg.text}
                        </div>
                    ))}
                </div>

                <form className="w-full mt-2" onSubmit={sendMessage}>
                    <input
                        className="px-4 py-3 rounded-md bg-secondary border border-neutral-600/50 w-full text-white"
                        type="text"
                        placeholder="Send a message"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </form>
            </div>
        </main>
    )
}
