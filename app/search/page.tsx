import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageMasthead } from "@/components/page-masthead"
import { ListCard } from "@/components/article-card"
import { getPosts } from "@/lib/wordpress"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Search",
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = (q || "").trim()
  const { articles } = query
    ? await getPosts({ search: query, perPage: 24 })
    : { articles: [] }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4">
        <PageMasthead
          eyebrow="Search"
          title={query ? `Results for “${query}”` : "Search The Chancellor"}
          description={
            query
              ? `${articles.length} ${articles.length === 1 ? "story" : "stories"} found.`
              : "Use the search bar in the header to find stories across the archive."
          }
        />

        {query && articles.length === 0 ? (
          <p className="py-20 text-center font-serif text-lg text-muted-foreground">
            No stories matched your search. Try a different term.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-border py-4">
            {articles.map((a) => (
              <ListCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
