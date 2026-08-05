export function PageMasthead({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <div className="border-b-2 border-foreground py-8">
      {eyebrow && (
        <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-accent">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-2 text-balance font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-2xl text-pretty font-serif text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}
