"use client"

import { RiSpeakAiFill } from "react-icons/ri";
import Link from "next/link"
import { FaMessage, FaPenToSquare, FaUser } from "react-icons/fa6";

export default function Messenger() {
    return (
        <>
            <div className="min-h-screen w-full flex bg-neutral-900/50">
                <aside className="w-2/6 flex">
                    <ul className="flex flex-col w-1/6 items-center py-8 space-y-8 grow">
                        <li><Link href="/"><RiSpeakAiFill /></Link></li>

                        <li><Link href="/"><FaMessage />{/*Here goes messages icon, click goes to messages tab, open by default*/}</Link></li>

                        <li className="mt-auto"><Link className="rounded-full border border-foreground size-8 flex items-center justify-center bg-foreground/10" href="/account"><FaUser />{/*Here goes avatar, click goes to account page*/}</Link></li>
                    </ul>
                    <div className="w-5/6 bg-neutral-900 py-8 shadow-xl">
                        <div className="flex flex-col space-y-4 pb-4 border-b border-neutral-600">
                            <div className="flex items-center justify-between px-6">
                                <h1>Messages</h1>
                                <button className="btn text-foreground"><FaPenToSquare /></button>
                            </div>
                            <div className="px-4">
                                <input type="search" className="bg-neutral-800 rounded-md w-full px-4 py-2" placeholder="Search contact" />
                            </div>
                        </div>
                        <ul className="px-6 py-4">
                            <li>Contacts go here</li>
                        </ul>
                    </div>
                </aside>
                <main className="w-3/6 flex flex-col relative bg-neutral-900/50">
                    <div className="flex h-[10vh] gap-6 bg-secondary/10 backdrop-blur-sm sticky top-0 left-0 items-center px-8 border-b border-neutral-600">
                        <div className="rounded-full border border-foreground size-8 flex items-center justify-center bg-foreground/10" >
                            <FaUser />{/*Here goes contact's avatar*/}
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm">Contact Name{/*Here goes contact's name*/}</h1>
                            <h1 className="text-xs text-neutral-400">Active status?{/*Here goes optional active status or last active*/}</h1>
                        </div>
                    </div>
                    <div className="flex flex-col size-full px-8 py-4">
                        <div className="flex flex-col size-full grow">
                            messages go here, map them
                        </div>
                        <form className="w-full">
                            <input className="px-4 py-3 rounded-md bg-secondary border border-neutral-600/50 w-full" type="text" placeholder="Send a message" />
                        </form>
                    </div>
                </main>
                <aside className="w-1/6 border-s border-neutral-600 bg-neutral-950/50">
                    <p>info about current contact</p>

                </aside>
            </div>
        </>
    )
}