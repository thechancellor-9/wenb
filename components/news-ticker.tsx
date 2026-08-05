"use client"

import Link from "next/link"
import type { Headline } from "@/lib/wordpress"

export function NewsTicker({ items }: { items: Headline[] }) {
  if (!items.length) return null

  // Duplicate the list so the marquee can loop seamlessly.
  const loop = [...items, ...items]

  return (
    <div className="border-b border-border bg-foreground text-background">
      <div className="mx-auto flex max-w-6xl items-stretch">
        {/* Fixed label */}
        <div className="flex shrink-0 items-center gap-2 bg-accent px-3 py-2 text-accent-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-foreground opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-foreground" />
          </span>
          <span className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em]">
            Latest
          </span>
        </div>

        {/* Scrolling headlines */}
        <div className="ticker-viewport group relative flex-1 overflow-hidden">
          <div className="ticker-track flex w-max items-center gap-8 py-2 pl-6">
            {loop.map((item, i) => (
              <Link
                key={`${item.slug}-${i}`}
                href={`/article/${item.slug}`}
                className="flex shrink-0 items-center gap-8 font-sans text-[0.8rem] tracking-wide text-background/90 transition-colors hover:text-background"
                aria-hidden={i >= items.length ? true : undefined}
                tabIndex={i >= items.length ? -1 : undefined}
              >
                <span className="text-accent">&#9670;</span>
                <span className="whitespace-nowrap">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
