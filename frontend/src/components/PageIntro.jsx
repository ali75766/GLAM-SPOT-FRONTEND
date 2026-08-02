function PageIntro({ eyebrow, title, copy }) {
  return (
    <section className="section-shell pt-8">
      <div className="glass-card overflow-hidden rounded-[2rem] border border-primary/10 px-6 py-10 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-foreground sm:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">{copy}</p>
      </div>
    </section>
  );
}

export default PageIntro;
