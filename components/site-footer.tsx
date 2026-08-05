import Link from "next/link"
import { NAV_SECTIONS } from "@/lib/wordpress"

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-16 border-t-2 border-foreground bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              The Chancellor
            </h2>
            <p className="mt-3 max-w-sm font-serif text-[0.95rem] leading-relaxed text-muted-foreground">
              A fortnightly review of politics, geopolitics, history, culture and
              ideas from Bharat and the world. Independent journalism, published
              every fortnight.
            </p>
          </div>

          <nav aria-label="Sections">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground">
              Sections
            </h3>
            <ul className="mt-4 space-y-2">
              {NAV_SECTIONS.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/category/${s.slug}`}
                    className="font-sans text-sm text-muted-foreground transition-colors hover:text-accent"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="The paper">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground">
              The Paper
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/category/editorial"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  Editorials
                </Link>
              </li>
              <li>
                <Link
                  href="/category/archive"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  Archive
                </Link>
              </li>
              <li>
                <a
                  href="https://thechancellor.in"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  Legacy Site
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
            &copy; {year} The Chancellor. All rights reserved.
          </p>
          <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
            Published fortnightly
          </p>
        </div>
      </div>
    </footer>
  )
}
