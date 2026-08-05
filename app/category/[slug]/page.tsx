import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageMasthead } from "@/components/page-masthead"
import { LeadCard, FeatureCard } from "@/components/article-card"
import {
  getCategoryBySlug,
  getPosts,
  stripHtml,
} from "@/lib/wordpress"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: "Section not found" }
  return {
    title: category.name,
    description:
      stripHtml(category.description || "") ||
      `The latest from ${category.name} in The Chancellor.`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const { articles } = await getPosts({ categoryId: category.id, perPage: 13 })

  const lead = articles[0]
  const rest = articles.slice(1)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4">
        <PageMasthead
          eyebrow="Section"
          title={category.name}
          description={stripHtml(category.description || "")}
        />

        {articles.length === 0 ? (
          <p className="py-20 text-center font-serif text-lg text-muted-foreground">
            No stories have been published in this section yet.
          </p>
        ) : (
          <>
            <div className="border-b border-border py-8">
              <LeadCard article={lead} />
            </div>
            {rest.length > 0 && (
              <div className="grid gap-x-8 gap-y-10 py-8 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((a) => (
                  <FeatureCard key={a.id} article={a} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
