"use client"

import Link from "next/link"

export default function HomeNav(){
    return(
        <nav className="flex items-center h-[10vh] px-[5vw] fixed top-0 left-0 w-full text-foreground/75 z-30">
            <div className="md:w-1/2 flex">
                <h1 className="font-sora text-xl">CHAT-TFU</h1>
            </div>
            <ul className="md:w-1/2 flex justify-evenly text-xs">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/messenger">Messenger</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/about">About</Link></li>
            </ul>
        </nav>
    )
}