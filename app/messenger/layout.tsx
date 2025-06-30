"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { RiSpeakAiFill } from "react-icons/ri"
import { FaMessage, FaUser, FaUserPlus } from "react-icons/fa6"
import Link from "next/link"

type Contact = {
  id: string
  name: string
  email: string
  conversationId: string
}

type ContactRequest = {
  id: string
  senderEmail: string
  senderName: string
}

export default function MessengerLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [emailInput, setEmailInput] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [requests, setRequests] = useState<ContactRequest[]>([])


  useEffect(() => {
    if (!session?.user?.id) return

    fetch("/api/contact/list")
      .then(res => res.json())
      .then(data => {
        setContacts(data.contacts || [])
        setRequests(data.requests || [])
      })
  }, [session])


  async function sendContactRequest(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/contact/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailInput }),
    })
    const json = await res.json()
    if (json.success) {
      setEmailInput("")
      alert("Request sent!")
    } else {
      alert(json.error || "Failed to send.")
    }
  }


  async function handleRequest(id: string, action: "ACCEPTED" | "DECLINED") {
    const res = await fetch("/api/contact/respond", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    })

    const json = await res.json()
    if (json.success) {
      setRequests(prev => prev.filter(r => r.id !== id))
      if (action === "ACCEPTED") setContacts(prev => [...prev, json.newContact])
    }
  }

  return (
    <section className="w-full h-full">
      <div className="min-h-screen w-full flex bg-neutral-900/50">
        {/* Sidebar */}
        <aside className="w-2/6 flex">
          <ul className="flex flex-col w-1/6 items-center py-8 space-y-8 grow">
            <li><Link href="/"><RiSpeakAiFill /></Link></li>
            <li><Link href="/messenger"><FaMessage /></Link></li>
            <li className="mt-auto">
              <Link className="rounded-full border border-foreground size-8 flex items-center justify-center bg-foreground/10" href="/account">
                <FaUser />
              </Link>
            </li>
          </ul>

          {/* Contact Panel */}
          <div className="w-5/6 bg-neutral-900 py-8 shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-neutral-600">
              <h1 className="text-xl font-bold">Messages</h1>
              <FaUserPlus />
            </div>

            {/* Request Form */}
            <form onSubmit={sendContactRequest} className="px-6 py-3 space-y-2 border-b border-neutral-700">
              <input
                type="email"
                className="bg-neutral-800 rounded-md w-full px-4 py-2 text-sm"
                placeholder="Send request by email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
              />
              <button type="submit" className="btn bg-secondary text-white w-full text-sm">Send Request</button>
            </form>

            {/* Pending Requests */}
            {requests.length > 0 && (
              <div className="px-6 py-3 border-b border-neutral-700">
                <h2 className="text-sm text-neutral-300 mb-2">Pending Requests</h2>
                {requests.map(r => (
                  <div key={r.id} className="flex items-center justify-between mb-2">
                    <span className="text-sm">{r.senderName} ({r.senderEmail})</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleRequest(r.id, "ACCEPTED")} className="text-green-400 text-xs">Accept</button>
                      <button onClick={() => handleRequest(r.id, "DECLINED")} className="text-red-400 text-xs">Deny</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Accepted Contacts */}
            <ul className="px-6 py-4 flex flex-col gap-3 overflow-auto">
            {contacts.length > 0 ?
            <div>
              {contacts.map(c => (
                <li key={c.id}>
                  <Link href={`/messenger/${c.conversationId}`} className="text-sm hover:underline text-neutral-100">
                    {c.name || c.email}
                  </Link>
                </li>
              ))}
            </div>
            :
            <div>
              <p>No contacts yet...</p>
            </div>
            }
            </ul>
          </div>
        </aside>

        {/* Chat Panel */}
        {children}

        {/* Right Sidebar */}
        <aside className="w-1/6 border-s border-neutral-600 bg-neutral-950/50 p-4">
          <p className="text-sm text-neutral-400">Contact info or profile details</p>
        </aside>
      </div>
    </section>
  )
}
