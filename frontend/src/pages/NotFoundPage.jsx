import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="section-shell py-24">
      <div className="glass-card rounded-[2rem] p-10 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-primary">404</p>
        <h1 className="mt-4 font-display text-6xl text-foreground">Lost in the nail studio</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-muted">
          The page you requested is not here yet. Head back to the storefront and continue exploring.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white"
        >
          Back home
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
