"use client"

import HomeNav from "@/components/HomeNav"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <main>

        <HomeNav />

        <header className="relative h-screen w-full pb-[10vh] overflow-clip">
          <div className="mx-auto px-[5vw] size-full flex md:flex-row flex-col items-end justify-between md:pt-0 pt-[10vh]">
            <div className="size-full md:w-1/2 md:h-auto h-1/2">
              <div className="max-w-sm md:text-start text-center flex flex-col space-y-8 size-full justify-end md:items-start md:mx-0 mx-auto">
                <h1 className="font-sora items-end text-5xl/snug font-light">Open-source <br className="md:inline hidden" /> and Security in Communication</h1>
                <p className="text-lg text-foreground/50 font-light">
                  Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
                </p>
              </div>
            </div>
            <div className="relative flex md:w-fit w-full md:h-auto h-1/2 md:items-start md:justify-start justify-center">
              <div className="absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 translate-y-1/3 md:w-[100vw] w-[125vw] aspect-[4/3] rounded-full bg-[radial-gradient(ellipse_at_center,theme(colors.violet.400)_0%,transparent_70%)] pointer-events-none z-[-1]" />
              <Link
                href="/messenger"
                className="btn bg-foreground rounded-full text-lg px-8 py-4 font-sora relative z-10 tracking-tight font-medium mt-16"
              >
                TRY MESSENGER
              </Link>
            </div>
          </div>
        </header>

      </main>
    </>
  )
}