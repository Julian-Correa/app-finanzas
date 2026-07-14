interface PlaceholderCardProps {
  title: string;
  description: string;
}

export function PlaceholderCard({ title, description }: PlaceholderCardProps) {
  return (
    <article className="rounded-card border border-slate-200/70 bg-white/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
      <div className="h-2 w-20 rounded-full bg-primary/20" />
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-400">{description}</p>
    </article>
  );
}
