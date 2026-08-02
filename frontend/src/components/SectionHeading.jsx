function SectionHeading({ eyebrow, title, copy, align = "left", action }) {
  const alignment =
    align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left";

  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${align === "center" ? "sm:block" : ""}`}>
      <div className={alignment}>
        {eyebrow ? (
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">{title}</h2>
        {copy ? <p className="mt-4 text-base leading-8 text-muted sm:text-lg">{copy}</p> : null}
      </div>
      {action}
    </div>
  );
}

export default SectionHeading;
