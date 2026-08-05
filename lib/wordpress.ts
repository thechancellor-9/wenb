// WordPress headless client for The Chancellor
// All content is fetched live (SSR) from the existing WordPress install.

const WP_BASE =
  process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "") || "https://thechancellor.in"

const API = `${WP_BASE}/wp-json/wp/v2`

// ----------------------------- Types -----------------------------

export interface WPRendered {
  rendered: string
}

export interface WPMediaSize {
  source_url: string
  width: number
  height: number
}

export interface WPPost {
  id: number
  slug: string
  date: string
  modified: string
  link: string
  title: WPRendered
  excerpt: WPRendered
  content: WPRendered
  author: number
  categories: number[]
  tags: number[]
  _embedded?: {
    author?: Array<{
      id: number
      name: string
      slug: string
      description?: string
      avatar_urls?: Record<string, string>
    }>
    "wp:featuredmedia"?: Array<{
      id: number
      source_url: string
      alt_text: string
      caption?: WPRendered
      media_details?: {
        sizes?: Record<string, WPMediaSize>
      }
    }>
    "wp:term"?: Array<
      Array<{
        id: number
        name: string
        slug: string
        taxonomy: string
      }>
    >
  }
}

export interface WPCategory {
  id: number
  name: string
  slug: string
  count: number
  description?: string
  parent: number
}

export interface WPPage {
  id: number
  slug: string
  title: WPRendered
  content: WPRendered
  modified: string
}

// A normalized static page (Privacy Policy, Terms, etc.) rendered as-is from WP.
export interface StaticPage {
  slug: string
  title: string
  content: string
  modified: string
}

// A lightweight headline used by the breaking-news ticker.
export interface Headline {
  title: string
  slug: string
}

export interface WPAuthor {
  id: number
  name: string
  slug: string
  description?: string
  avatar_urls?: Record<string, string>
}

// Normalized shape the UI actually consumes.
export interface Article {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  modified: string
  authorName: string
  authorSlug: string
  categoryName: string
  categorySlug: string
  imageUrl: string | null
  imageAlt: string
  imageCaption: string
  tags: Array<{ name: string; slug: string }>
}

// --------------------------- Utilities ---------------------------

// Sections shown in the primary navigation, in editorial priority order.
export const NAV_SECTIONS: Array<{ name: string; slug: string }> = [
  { name: "Cover Story", slug: "cover-story" },
  { name: "Editorial", slug: "editorial" },
  { name: "Op-Ed", slug: "op-ed" },
  { name: "Geo-Politics", slug: "geo-politics" },
  { name: "Spirituality", slug: "spirituality" },
  { name: "Unsung Heroes", slug: "unsung-heroes" },
  { name: "Book Review", slug: "book-review" },
  { name: "Archive", slug: "archive" },
]

// Documentation / legal pages pulled directly from WordPress (by slug).
export const DOC_PAGES: Array<{ name: string; slug: string }> = [
  { name: "Privacy Policy", slug: "privacy-policy" },
  { name: "Terms & Conditions", slug: "terms-conditions" },
  { name: "Refund & Cancellation", slug: "refund-cancellation-policy" },
  { name: "Subscription", slug: "subscription" },
]

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8220;/g, "\u201c")
    .replace(/&#8221;/g, "\u201d")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "\u2026")
    .replace(/&#8211;/g, "\u2013")
    .replace(/&#8212;/g, "\u2014")
    .replace(/\s+/g, " ")
    .trim()
}

export function decodeEntities(text: string): string {
  return stripHtml(text)
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return ""
  }
}

function pickImage(post: WPPost): { url: string | null; alt: string; caption: string } {
  const media = post._embedded?.["wp:featuredmedia"]?.[0]
  if (!media) return { url: null, alt: "", caption: "" }
  const sizes = media.media_details?.sizes
  const url = sizes?.full?.source_url || sizes?.medium?.source_url || media.source_url || null
  return {
    url,
    alt: media.alt_text || "",
    caption: media.caption ? stripHtml(media.caption.rendered) : "",
  }
}

export function normalize(post: WPPost): Article {
  const author = post._embedded?.author?.[0]
  const terms = post._embedded?.["wp:term"] || []
  const categories = terms.find((g) => g[0]?.taxonomy === "category") || []
  const tagTerms = terms.find((g) => g[0]?.taxonomy === "post_tag") || []
  const primaryCategory = categories.find((c) => c.slug !== "uncategorized") || categories[0]
  const image = pickImage(post)

  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    excerpt: stripHtml(post.excerpt.rendered),
    content: post.content.rendered,
    date: post.date,
    modified: post.modified,
    authorName: author?.name ? stripHtml(author.name) : "The Chancellor",
    authorSlug: author?.slug || "",
    categoryName: primaryCategory?.name || "Dispatch",
    categorySlug: primaryCategory?.slug || "",
    imageUrl: image.url,
    imageAlt: image.alt,
    imageCaption: image.caption,
    tags: tagTerms.map((t) => ({ name: t.name, slug: t.slug })),
  }
}

async function wpFetch<T>(path: string): Promise<{ data: T; totalPages: number }> {
  const res = await fetch(`${API}${path}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  })
  if (!res.ok) {
    throw new Error(`WordPress request failed: ${res.status} ${path}`)
  }
  const totalPages = Number(res.headers.get("X-WP-TotalPages") || "1")
  const data = (await res.json()) as T
  return { data, totalPages }
}

// ------------------------- Data accessors -------------------------

export async function getPosts(params: {
  perPage?: number
  page?: number
  categoryId?: number
  authorId?: number
  search?: string
  exclude?: number[]
} = {}): Promise<{ articles: Article[]; totalPages: number }> {
  const q = new URLSearchParams({
    _embed: "1",
    per_page: String(params.perPage ?? 12),
    page: String(params.page ?? 1),
    orderby: "date",
    order: "desc",
  })
  if (params.categoryId) q.set("categories", String(params.categoryId))
  if (params.authorId) q.set("author", String(params.authorId))
  if (params.search) q.set("search", params.search)
  if (params.exclude?.length) q.set("exclude", params.exclude.join(","))

  try {
    const { data, totalPages } = await wpFetch<WPPost[]>(`/posts?${q.toString()}`)
    return { articles: data.map(normalize), totalPages }
  } catch {
    return { articles: [], totalPages: 0 }
  }
}

export async function getPostBySlug(slug: string): Promise<Article | null> {
  try {
    const { data } = await wpFetch<WPPost[]>(
      `/posts?slug=${encodeURIComponent(slug)}&_embed=1`,
    )
    if (!data.length) return null
    return normalize(data[0])
  } catch {
    return null
  }
}

export async function getCategories(): Promise<WPCategory[]> {
  try {
    const { data } = await wpFetch<WPCategory[]>(
      `/categories?per_page=100&orderby=count&order=desc&_fields=id,name,slug,count,description,parent`,
    )
    return data.filter((c) => c.slug !== "uncategorized")
  } catch {
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<WPCategory | null> {
  try {
    const { data } = await wpFetch<WPCategory[]>(
      `/categories?slug=${encodeURIComponent(slug)}`,
    )
    return data[0] ?? null
  } catch {
    return null
  }
}

export async function getAuthorBySlug(slug: string): Promise<WPAuthor | null> {
  try {
    const { data } = await wpFetch<WPAuthor[]>(
      `/users?slug=${encodeURIComponent(slug)}`,
    )
    return data[0] ?? null
  } catch {
    return null
  }
}

// Fetch a static WordPress page (e.g. Privacy Policy) by slug, rendered as-is.
export async function getPageBySlug(slug: string): Promise<StaticPage | null> {
  try {
    const { data } = await wpFetch<WPPage[]>(
      `/pages?slug=${encodeURIComponent(slug)}&_fields=id,slug,title,content,modified`,
    )
    if (!data.length) return null
    const page = data[0]
    return {
      slug: page.slug,
      title: stripHtml(page.title.rendered),
      content: page.content.rendered,
      modified: page.modified,
    }
  } catch {
    return null
  }
}

// Recent headlines for the breaking-news ticker.
export async function getRecentHeadlines(limit = 12): Promise<Headline[]> {
  try {
    const { data } = await wpFetch<WPPost[]>(
      `/posts?per_page=${limit}&orderby=date&order=desc&_fields=slug,title`,
    )
    return data.map((p) => ({ title: stripHtml(p.title.rendered), slug: p.slug }))
  } catch {
    return []
  }
}

// Fetch several categories' latest posts in parallel for the homepage.
export async function getSectionArticles(
  categories: WPCategory[],
  perSection = 4,
): Promise<Array<{ category: WPCategory; articles: Article[] }>> {
  const results = await Promise.all(
    categories.map(async (category) => {
      const { articles } = await getPosts({
        categoryId: category.id,
        perPage: perSection,
      })
      return { category, articles }
    }),
  )
  return results.filter((r) => r.articles.length > 0)
}
