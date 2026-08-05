import Link from "next/link"
import type { Article } from "@/lib/wordpress"
import { formatDate } from "@/lib/wordpress"

function Kicker({ article }: { article: Article }) {
  if (!article.categorySlug) return null
  return (
    <Link
      href={`/category/${article.categorySlug}`}
      className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-accent hover:underline"
    >
      {article.categoryName}
    </Link>
  )
}

function Byline({ article }: { article: Article }) {
  return (
    <p className="font-sans text-xs text-muted-foreground">
      By <span className="text-foreground">{article.authorName}</span>
      <span className="mx-1.5" aria-hidden="true">
        &middot;
      </span>
      {formatDate(article.date)}
    </p>
  )
}

// Large lead story for the top of the homepage / category pages.
export function LeadCard({ article }: { article: Article }) {
  return (
    <article className="grid gap-6 md:grid-cols-2 md:gap-8">
      <Link
        href={`/article/${article.slug}`}
        className="group order-1 block overflow-hidden md:order-2"
      >
        {article.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.imageAlt || article.title}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="aspect-[4/3] w-full bg-secondary" />
        )}
      </Link>
      <div className="order-2 flex flex-col justify-center md:order-1">
        <Kicker article={article} />
        <Link href={`/article/${article.slug}`} className="group mt-3 block">
          <h2 className="text-balance font-serif text-3xl font-bold leading-[1.1] tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-4xl md:text-5xl">
            {article.title}
          </h2>
        </Link>
        {article.excerpt && (
          <p className="mt-4 text-pretty font-serif text-lg leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        )}
        <div className="mt-4">
          <Byline article={article} />
        </div>
      </div>
    </article>
  )
}

// Standard feature card with image on top.
export function FeatureCard({ article }: { article: Article }) {
  return (
    <article className="flex flex-col">
      <Link
        href={`/article/${article.slug}`}
        className="group block overflow-hidden"
      >
        {article.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.imageAlt || article.title}
            className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="aspect-[3/2] w-full bg-secondary" />
        )}
      </Link>
      <div className="mt-3 flex flex-col">
        <Kicker article={article} />
        <Link href={`/article/${article.slug}`} className="group mt-1.5 block">
          <h3 className="text-balance font-serif text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-accent">
            {article.title}
          </h3>
        </Link>
        {article.excerpt && (
          <p className="mt-2 line-clamp-3 text-pretty font-serif text-[0.95rem] leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        )}
        <div className="mt-2.5">
          <Byline article={article} />
        </div>
      </div>
    </article>
  )
}

// Compact headline-only item for lists and sidebars.
export function HeadlineItem({
  article,
  showExcerpt = false,
}: {
  article: Article
  showExcerpt?: boolean
}) {
  return (
    <article className="flex flex-col py-4">
      <Kicker article={article} />
      <Link href={`/article/${article.slug}`} className="group mt-1 block">
        <h3 className="text-balance font-serif text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
          {article.title}
        </h3>
      </Link>
      {showExcerpt && article.excerpt && (
        <p className="mt-1.5 line-clamp-2 font-serif text-sm leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
      )}
      <div className="mt-2">
        <Byline article={article} />
      </div>
    </article>
  )
}

// Horizontal card with a small thumbnail (used in section rails and search).
export function ListCard({ article }: { article: Article }) {
  return (
    <article className="flex gap-4 py-4">
      <Link
        href={`/article/${article.slug}`}
        className="group block w-28 shrink-0 overflow-hidden sm:w-36"
      >
        {article.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.imageAlt || article.title}
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="aspect-square w-full bg-secondary" />
        )}
      </Link>
      <div className="flex flex-col">
        <Kicker article={article} />
        <Link href={`/article/${article.slug}`} className="group mt-1 block">
          <h3 className="text-balance font-serif text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-accent sm:text-lg">
            {article.title}
          </h3>
        </Link>
        <div className="mt-1.5">
          <Byline article={article} />
        </div>
      </div>
    </article>
  )
}
