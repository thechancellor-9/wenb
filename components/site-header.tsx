"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Menu, X, Search, ChevronDown } from "lucide-react"
import { NAV_SECTIONS } from "@/lib/wordpress"

function currentDateline() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function SiteHeader() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [sectionsOpen, setSectionsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const sectionsRef = useRef<HTMLDivElement>(null)

  // Close the Sections dropdown on outside click or Escape.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (sectionsRef.current && !sectionsRef.current.contains(e.target as Node)) {
        setSectionsOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSectionsOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setSearchOpen(false)
    setMenuOpen(false)
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="border-b-2 border-foreground bg-background">
      {/* Top utility bar */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs">
          <span className="hidden font-sans uppercase tracking-widest text-muted-foreground sm:block">
            {currentDateline()}
          </span>
          <span className="font-sans uppercase tracking-widest text-accent">
            Fortnightly Edition
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="font-sans uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
            <button
              type="button"
              aria-label="Toggle search"
              onClick={() => setSearchOpen((v) => !v)}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Toggle menu"
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/" className="mx-auto block" aria-label="The Chancellor — home">
            <Image
              src="/chancellor-logo.png"
              alt="The Chancellor"
              width={1208}
              height={178}
              priority
              className="h-12 w-auto sm:h-14 md:h-16"
            />
          </Link>
          <span className="hidden w-6 md:block" aria-hidden="true" />
        </div>
        <p className="mt-3 text-center font-sans text-[0.68rem] uppercase tracking-[0.35em] text-muted-foreground">
          A Fortnightly Review of Ideas &amp; Affairs
        </p>
      </div>

      {/* Search bar (toggle) */}
      {searchOpen && (
        <div className="border-t border-border bg-secondary">
          <form
            onSubmit={submitSearch}
            className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search The Chancellor…"
              className="w-full bg-transparent font-serif text-lg outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="font-sans text-xs font-semibold uppercase tracking-widest text-accent"
            >
              Go
            </button>
          </form>
        </div>
      )}

      {/* Section navigation */}
      <nav className="border-t border-border" aria-label="Sections">
        <div className="mx-auto hidden max-w-6xl items-center justify-center gap-6 px-4 py-2.5 md:flex">
          <Link
            href="/"
            className="font-sans text-[0.78rem] font-semibold uppercase tracking-wider text-foreground transition-colors hover:text-accent"
          >
            Home
          </Link>

          {/* Sections dropdown */}
          <div className="relative" ref={sectionsRef}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={sectionsOpen}
              onClick={() => setSectionsOpen((v) => !v)}
              className="flex items-center gap-1 font-sans text-[0.78rem] font-semibold uppercase tracking-wider text-foreground transition-colors hover:text-accent"
            >
              Sections
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${sectionsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {sectionsOpen && (
              <div className="absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 border-2 border-foreground bg-background shadow-lg">
                {NAV_SECTIONS.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/category/${s.slug}`}
                    onClick={() => setSectionsOpen(false)}
                    className="block border-b border-border px-4 py-2.5 font-sans text-[0.78rem] font-medium uppercase tracking-wider text-muted-foreground transition-colors last:border-b-0 hover:bg-secondary hover:text-accent"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/about"
            className="font-sans text-[0.78rem] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-accent"
          >
            About
          </Link>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="flex flex-col md:hidden">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="border-t border-border px-4 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-foreground"
            >
              Home
            </Link>
            <p className="border-t border-border bg-secondary px-4 py-2 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Sections
            </p>
            {NAV_SECTIONS.map((s) => (
              <Link
                key={s.slug}
                href={`/category/${s.slug}`}
                onClick={() => setMenuOpen(false)}
                className="border-t border-border px-4 py-3 pl-6 font-sans text-sm font-medium uppercase tracking-wider text-muted-foreground"
              >
                {s.name}
              </Link>
            ))}
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="border-t border-border px-4 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-foreground"
            >
              About
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
