import Link from "next/link"
import type { Article, WPCategory } from "@/lib/wordpress"
import { FeatureCard, HeadlineItem } from "@/components/article-card"

export function SectionHeading({
  title,
  href,
}: {
  title: string
  href?: string
}) {
  const content = (
    <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">
      {title}
    </h2>
  )
  return (
    <div className="mb-5 flex items-end justify-between border-b-2 border-foreground pb-2">
      {href ? (
        <Link href={href} className="transition-colors hover:text-accent">
          {content}
        </Link>
      ) : (
        content
      )}
      {href && (
        <Link
          href={href}
          className="font-sans text-[0.7rem] font-semibold uppercase tracking-widest text-accent hover:underline"
        >
          More
        </Link>
      )}
    </div>
  )
}

// A homepage section: lead feature + a column of headlines.
export function SectionBlock({
  category,
  articles,
}: {
  category: WPCategory
  articles: Article[]
}) {
  if (!articles.length) return null
  const [lead, ...rest] = articles

  return (
    <section className="py-8">
      <SectionHeading title={category.name} href={`/category/${category.slug}`} />
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <FeatureCard article={lead} />
        <div className="flex flex-col divide-y divide-border border-t border-border md:border-t-0 md:pl-8">
          {rest.length > 0 ? (
            rest.map((a) => <HeadlineItem key={a.id} article={a} showExcerpt />)
          ) : (
            <p className="py-4 font-serif text-sm text-muted-foreground">
              More from this section coming soon.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
