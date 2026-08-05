import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ListCard } from "@/components/article-card"
import {
  getPostBySlug,
  getCategoryBySlug,
  getPosts,
  formatDate,
} from "@/lib/wordpress"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getPostBySlug(slug)
  if (!article) return { title: "Story not found" }
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getPostBySlug(slug)
  if (!article) notFound()

  // Related stories from the same section.
  let related = [] as Awaited<ReturnType<typeof getPosts>>["articles"]
  if (article.categorySlug) {
    const category = await getCategoryBySlug(article.categorySlug)
    if (category) {
      const { articles } = await getPosts({
        categoryId: category.id,
        perPage: 5,
        exclude: [article.id],
      })
      related = articles.slice(0, 4)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-10">
          {/* Header */}
          <header>
            {article.categorySlug && (
              <Link
                href={`/category/${article.categorySlug}`}
                className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-accent hover:underline"
              >
                {article.categoryName}
              </Link>
            )}
            <h1 className="mt-3 text-balance font-serif text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="mt-5 text-pretty font-serif text-xl leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-border py-4">
              <p className="font-sans text-sm text-foreground">
                By{" "}
                {article.authorSlug ? (
                  <Link
                    href={`/author/${article.authorSlug}`}
                    className="font-semibold hover:text-accent"
                  >
                    {article.authorName}
                  </Link>
                ) : (
                  <span className="font-semibold">{article.authorName}</span>
                )}
              </p>
              <span className="text-muted-foreground" aria-hidden="true">
                &middot;
              </span>
              <time
                dateTime={article.date}
                className="font-sans text-sm text-muted-foreground"
              >
                {formatDate(article.date)}
              </time>
            </div>
          </header>

          {/* Featured image */}
          {article.imageUrl && (
            <figure className="mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.imageAlt || article.title}
                className="w-full object-cover"
              />
              {article.imageCaption && (
                <figcaption className="mt-2 font-sans text-xs text-muted-foreground">
                  {article.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Body */}
          <div
            className="article-body mt-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6">
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Filed under
              </span>
              {article.tags.map((t) => (
                <span
                  key={t.slug}
                  className="border border-border px-2.5 py-1 font-sans text-xs text-foreground"
                >
                  {t.name}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="border-t-2 border-foreground bg-secondary">
            <div className="mx-auto max-w-3xl px-4 py-10">
              <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">
                More from {article.categoryName}
              </h2>
              <div className="flex flex-col divide-y divide-border">
                {related.map((a) => (
                  <ListCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
