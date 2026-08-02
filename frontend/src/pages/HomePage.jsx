import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";
import SectionHeading from "../components/SectionHeading";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import WhyChooseUs from "../components/WhyChooseUs";
import { fetchCategories, fetchProducts } from "../lib/api";

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [categoryData, productData] = await Promise.all([
        fetchCategories(),
        fetchProducts({ featured: true, limit: 4 })
      ]);

      setCategories(categoryData);
      setProducts(productData.items.slice(0, 4));
    };

    loadData();
  }, []);

  return (
    <>
      <HeroCarousel categories={categories} />

      <section className="section-shell py-20">
        <SectionHeading
          eyebrow="Nail services"
          title="Studio shelves arranged around every kind of nail day"
          copy="Browse curated manicure, extension and nail-art categories with a softer studio feel, cleaner spacing and product-ready detail."
          action={
            <Link
              to="/categories"
              className="rounded-full border border-primary/50 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              View all
            </Link>
          }
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.slice(0, 6).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-primary px-4 py-16 text-white">
        <div className="section-shell flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/70">New studio guest</p>
            <h2 className="mt-4 font-display text-5xl leading-tight">Book your first nail appointment with confidence</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/80">
              Choose your preferred nail look, add care products when needed, and keep every appointment-ready detail in one polished storefront.
            </p>
          </div>
          <Link
            to="/booking"
            className="rounded-full bg-white px-8 py-4 text-base font-semibold text-primary transition hover:-translate-y-0.5"
          >
            Book now
          </Link>
        </div>
      </section>

      <section className="section-shell py-20">
        <SectionHeading
          eyebrow="Featured nail picks"
          title="Polish, care and studio essentials worth adding to cart"
          copy="Discover a tight nail-focused selection with quick actions that stay functional across the entire storefront."
          action={
            <Link
              to="/products"
              className="rounded-full border border-primary/50 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              Browse all
            </Link>
          }
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <WhyChooseUs />
    </>
  );
}

export default HomePage;
