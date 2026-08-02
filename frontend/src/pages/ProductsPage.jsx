import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageIntro from "../components/PageIntro";
import ProductFilters from "../components/ProductFilters";
import ProductCard from "../components/ProductCard";
import { fetchCategories, fetchProducts } from "../lib/api";

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    sort: "latest"
  });
  const deferredSearch = useDeferredValue(filters.search);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const page = Number(searchParams.get("page") || 1);

    const loadProducts = async () => {
      setLoading(true);
      const data = await fetchProducts({
        page,
        limit: 6,
        category: filters.category || undefined,
        search: deferredSearch || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        sort: filters.sort
      });

      setProducts(data.items);
      setPagination(data.pagination);
      setLoading(false);
    };

    loadProducts();
  }, [deferredSearch, filters.category, filters.maxPrice, filters.minPrice, filters.sort, searchParams]);

  const updateFilters = (key, value) => {
    startTransition(() => {
      setFilters((current) => ({ ...current, [key]: value }));

      const nextParams = new URLSearchParams(searchParams);

      if (key === "category") {
        if (value) {
          nextParams.set("category", value);
        } else {
          nextParams.delete("category");
        }
      }

      nextParams.delete("page");
      setSearchParams(nextParams);
    });
  };

  const changePage = (page) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(page));
    setSearchParams(nextParams);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "latest"
    });
    setSearchParams(new URLSearchParams());
  };

  return (
    <>
      <PageIntro
        eyebrow="Nail services"
        title="Browse the full edit of nail products and studio essentials"
        copy="Filter by category, search for what you need and open any item for a more detailed shopping view."
      />

      <section className="section-shell py-16">
        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          <ProductFilters
            categories={categories}
            filters={filters}
            onSearchChange={(value) => updateFilters("search", value)}
            onCategoryChange={(value) => updateFilters("category", value)}
            onPriceChange={(key, value) => updateFilters(key, value)}
            onSortChange={(value) => updateFilters("sort", value)}
            onReset={resetFilters}
          />

          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-primary">Product listing</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  {loading ? "Loading..." : `${pagination.total} products`}
                </h2>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="glass-card h-[28rem] animate-pulse rounded-[1.75rem]" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  {Array.from({ length: pagination.totalPages }, (_, index) => {
                    const page = index + 1;

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => changePage(page)}
                        className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                          page === pagination.page
                            ? "border-primary bg-primary text-white"
                            : "border-line bg-surface text-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductsPage;
