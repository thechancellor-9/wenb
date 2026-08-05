import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-accent">
          404
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 font-serif text-lg leading-relaxed text-muted-foreground">
          The story you are looking for may have been moved, retitled, or does
          not exist.
        </p>
        <Link
          href="/"
          className="mt-6 border-2 border-foreground px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          Return to the front page
        </Link>
      </main>
      <SiteFooter />
    </div>
  )
}
