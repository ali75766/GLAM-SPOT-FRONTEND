import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCalendar, FiHeart, FiImage, FiShoppingBag } from "react-icons/fi";
import { GiSparkles } from "react-icons/gi";
import {
  PiCrown,
  PiDiamondsFour,
  PiDrop,
  PiHandHeart,
  PiMagicWand,
  PiPaintBrushBroad,
  PiPalette,
  PiSparkle
} from "react-icons/pi";

const categoryIconMap = {
  "acrylic-nails": PiPaintBrushBroad,
  "gel-nails": PiDrop,
  "french-tips": PiPalette,
  "bridal-nails": PiCrown,
  "chrome-nails": PiSparkle,
  "nail-care": PiHandHeart,
  "custom-nail-art": PiMagicWand,
  "nail-extensions": PiDiamondsFour
};

const getCategoryIcon = (category) => categoryIconMap[category?.slug] || PiSparkle;

function HeroCarousel({ categories = [] }) {
  const featuredCategories = categories.slice(0, 4);
  const iconCategories = categories.slice(0, 8);
  const [leftAccentCategory, rightAccentCategory] = categories;

  return (
    <section className="relative overflow-hidden border-b border-line/70 bg-[linear-gradient(90deg,rgba(238,225,250,0.58),rgba(255,251,247,0.94)_42%,rgba(255,226,204,0.45))]">
      {leftAccentCategory?.imageUrl ? (
        <img
          src={leftAccentCategory.imageUrl}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-0 hidden h-full w-96 rotate-[-10deg] object-cover opacity-20 blur-[1px] lg:block"
        />
      ) : null}
      {rightAccentCategory?.imageUrl ? (
        <img
          src={rightAccentCategory.imageUrl}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 top-0 hidden h-full w-96 rotate-[10deg] object-cover opacity-20 blur-[1px] lg:block"
        />
      ) : null}

      <div className="section-shell relative grid min-h-[calc(100vh-5rem)] items-center gap-10 py-10 lg:grid-cols-[0.96fr_1.04fr] lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-surface/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary shadow-card backdrop-blur">
            <FiHeart />
            Beautiful nails, confident you.
          </span>
          <h1 className="mt-6 font-display text-6xl leading-[0.88] text-foreground sm:text-7xl lg:text-8xl">
            Create Stunning Nails That <span className="text-primary">Turn Heads</span>
          </h1>
          <div className="mt-5 flex w-64 max-w-full items-center gap-3 text-primary">
            <span className="h-px flex-1 bg-primary/30" />
            <GiSparkles className="text-2xl" />
            <span className="h-px flex-1 bg-primary/30" />
          </div>
          <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg">
            From classy manicures to trendy nail art, Glam Nail Studio delivers premium nail services and curated products designed to keep your nails healthy, stylish, and salon-perfect.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Link to="/booking" className="action-button-primary px-5">
              <FiCalendar />
              Book Appointment
            </Link>
            <Link to="/categories" className="action-button-secondary px-5">
              <GiSparkles />
              Explore Designs
            </Link>
            <Link to="/gallery" className="action-button-secondary px-5">
              <FiImage />
              View Gallery
            </Link>
            <Link to="/products" className="action-button-secondary px-5">
              <FiShoppingBag />
              Shop Products
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.65, ease: "easeOut" }}
          className="rounded-[2rem] border border-white/80 bg-surface/90 px-5 py-7 shadow-[0_30px_90px_rgba(55,35,74,0.12)] backdrop-blur-xl sm:px-8"
        >
          <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Trending nail collection
          </p>
          <h2 className="mt-4 text-center font-display text-4xl leading-tight text-foreground">
            Nails That Match Your Vibe
          </h2>
          <div className="mx-auto mt-3 flex w-32 items-center gap-3 text-primary">
            <span className="h-px flex-1 bg-primary/30" />
            <FiHeart />
            <span className="h-px flex-1 bg-primary/30" />
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featuredCategories.length ? (
              featuredCategories.map((category) => {
                const Icon = getCategoryIcon(category);

                return (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className="group text-center"
                  >
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="mx-auto h-28 w-28 rounded-full border-4 border-secondary object-cover shadow-card transition duration-500 group-hover:scale-105"
                    />
                    <h3 className="mt-4 flex min-h-12 items-start justify-center gap-1.5 text-sm font-bold leading-5 text-foreground">
                      <Icon className="mt-0.5 shrink-0 text-primary" />
                      {category.name}
                    </h3>
                    <p className="mx-auto mt-2 line-clamp-3 max-w-36 text-xs leading-6 text-muted">
                      {category.description}
                    </p>
                  </Link>
                );
              })
            ) : (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto h-28 w-28 animate-pulse rounded-full bg-secondary/70" />
                  <div className="mx-auto mt-4 h-4 w-24 animate-pulse rounded-full bg-secondary/70" />
                  <div className="mx-auto mt-3 h-3 w-28 animate-pulse rounded-full bg-secondary/50" />
                </div>
              ))
            )}
          </div>
        </motion.div>

        <div className="lg:col-span-2">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 flex items-center justify-center gap-4 text-primary">
              <span className="h-px w-14 bg-primary/35" />
              <h2 className="font-display text-3xl text-foreground">Popular Nail Categories</h2>
              <span className="h-px w-14 bg-primary/35" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {iconCategories.map((category) => {
                const Icon = getCategoryIcon(category);

                return (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className="group flex flex-col items-center gap-3 rounded-2xl border border-line/70 bg-surface/70 px-3 py-4 text-center shadow-card backdrop-blur transition hover:-translate-y-1 hover:border-primary/35"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/15 bg-secondary/65 text-2xl text-primary transition group-hover:bg-primary group-hover:text-white">
                      <Icon />
                    </span>
                    <span className="text-xs font-semibold text-foreground">{category.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;
