import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageMasthead } from "@/components/page-masthead"
import { FeatureCard } from "@/components/article-card"
import { getAuthorBySlug, getPosts, stripHtml } from "@/lib/wordpress"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) return { title: "Contributor not found" }
  return {
    title: stripHtml(author.name),
    description: stripHtml(author.description || "") || `Articles by ${author.name}.`,
  }
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) notFound()

  const { articles } = await getPosts({ authorId: author.id, perPage: 24 })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4">
        <PageMasthead
          eyebrow="Contributor"
          title={stripHtml(author.name)}
          description={stripHtml(author.description || "")}
        />

        {articles.length === 0 ? (
          <p className="py-20 text-center font-serif text-lg text-muted-foreground">
            No stories from this contributor yet.
          </p>
        ) : (
          <div className="grid gap-x-8 gap-y-10 py-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <FeatureCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
