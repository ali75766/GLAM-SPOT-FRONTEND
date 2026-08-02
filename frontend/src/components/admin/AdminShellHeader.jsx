function AdminShellHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-5 border-b border-line pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-primary">{eyebrow}</p>
        <h1 className="mt-3 font-display text-5xl leading-none text-foreground">{title}</h1>
        {description ? <p className="mt-4 max-w-3xl text-base leading-8 text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export default AdminShellHeader;
