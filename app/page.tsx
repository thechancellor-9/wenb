import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FeatureCard, HeadlineItem } from "@/components/article-card"
import { SectionBlock } from "@/components/section-block"
import {
  getPosts,
  getCategories,
  getSectionArticles,
  formatDate,
  NAV_SECTIONS,
  type Article,
} from "@/lib/wordpress"

export const dynamic = "force-dynamic"

function HomeHero({ lead, latest }: { lead: Article; latest: Article[] }) {
  return (
    <section className="border-b border-border py-8">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Lead story */}
        <article className="lg:pr-8">
          <Link
            href={`/article/${lead.slug}`}
            className="group block overflow-hidden"
          >
            {lead.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={lead.imageUrl || "/placeholder.svg"}
                alt={lead.imageAlt || lead.title}
                className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="aspect-[16/9] w-full bg-secondary" />
            )}
          </Link>
          {lead.categorySlug && (
            <Link
              href={`/category/${lead.categorySlug}`}
              className="mt-4 inline-block font-sans text-xs font-bold uppercase tracking-[0.18em] text-accent hover:underline"
            >
              {lead.categoryName}
            </Link>
          )}
          <Link href={`/article/${lead.slug}`} className="group mt-2 block">
            <h2 className="text-balance font-serif text-4xl font-bold leading-[1.05] tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-5xl">
              {lead.title}
            </h2>
          </Link>
          {lead.excerpt && (
            <p className="mt-4 max-w-2xl text-pretty font-serif text-lg leading-relaxed text-muted-foreground">
              {lead.excerpt}
            </p>
          )}
          <p className="mt-4 font-sans text-xs text-muted-foreground">
            By <span className="text-foreground">{lead.authorName}</span>
            <span className="mx-1.5" aria-hidden="true">
              &middot;
            </span>
            {formatDate(lead.date)}
          </p>
        </article>

        {/* Latest rail */}
        <aside className="lg:border-l lg:border-border lg:pl-8">
          <h2 className="mb-2 border-b-2 border-accent pb-2 font-sans text-sm font-bold uppercase tracking-widest text-foreground">
            The Latest
          </h2>
          <div className="flex flex-col divide-y divide-border">
            {latest.map((a) => (
              <HeadlineItem key={a.id} article={a} />
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default async function HomePage() {
  const [{ articles: top }, categories] = await Promise.all([
    getPosts({ perPage: 10 }),
    getCategories(),
  ])

  // Choose the sections to feature, in the order defined by NAV_SECTIONS.
  const orderedSlugs = NAV_SECTIONS.map((s) => s.slug)
  const sectionCategories = categories
    .filter((c) => orderedSlugs.includes(c.slug) && c.count > 0)
    .sort((a, b) => orderedSlugs.indexOf(a.slug) - orderedSlugs.indexOf(b.slug))
    .slice(0, 6)

  const sections = await getSectionArticles(sectionCategories, 4)

  const lead = top[0]
  const latest = top.slice(1, 6)
  const featureRow = top.slice(6, 9)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4">
        {lead ? (
          <>
            <HomeHero lead={lead} latest={latest} />

            {featureRow.length > 0 && (
              <section className="grid gap-8 border-b border-border py-8 md:grid-cols-3">
                {featureRow.map((a) => (
                  <FeatureCard key={a.id} article={a} />
                ))}
              </section>
            )}

            {sections.map(({ category, articles }) => (
              <SectionBlock
                key={category.id}
                category={category}
                articles={articles}
              />
            ))}
          </>
        ) : (
          <div className="py-24 text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Unable to load stories
            </h2>
            <p className="mt-2 font-serif text-muted-foreground">
              We couldn&apos;t reach the newsroom just now. Please refresh in a
              moment.
            </p>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
