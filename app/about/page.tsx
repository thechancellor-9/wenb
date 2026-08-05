import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageMasthead } from "@/components/page-masthead"

export const metadata: Metadata = {
  title: "About",
  description:
    "About The Chancellor — a fortnightly review of politics, geopolitics, history, culture and ideas.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4">
        <PageMasthead
          eyebrow="About"
          title="The Chancellor"
          description="A fortnightly review of ideas and affairs."
        />
        <div className="article-body py-10">
          <p>
            The Chancellor is an independent fortnightly review, publishing
            long-form journalism, essays and criticism across politics,
            geopolitics, history, spirituality, and culture. Every fortnight we
            bring together reporting and argument with the conviction that
            serious subjects deserve unhurried, considered treatment.
          </p>
          <h2>Our sections</h2>
          <p>
            From the <strong>Cover Story</strong> and <strong>Editorial</strong>{" "}
            to <strong>Op-Ed</strong>, <strong>Geo-Politics</strong>,{" "}
            <strong>Unsung Heroes</strong> and the <strong>Book Review</strong>,
            each edition is organised around the questions that matter most to a
            thoughtful readership.
          </p>
          <h2>Editorial philosophy</h2>
          <p>
            We believe in the primacy of the written word, in evidence over
            noise, and in the long view over the news cycle. Our contributors
            write with independence and rigour, and our pages remain open to
            argument conducted in good faith.
          </p>
          <blockquote>
            Journalism worth keeping — published every fortnight.
          </blockquote>
          <p>
            This site is the digital front for The Chancellor, drawing its
            stories directly from our newsroom. To explore past editions, visit
            the Archive, or browse any section from the navigation above.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
