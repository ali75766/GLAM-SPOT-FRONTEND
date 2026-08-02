function ProductFilters({
  categories,
  filters,
  onSearchChange,
  onCategoryChange,
  onPriceChange,
  onSortChange,
  onReset
}) {
  return (
    <aside className="glass-card h-fit rounded-[1.75rem] p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        <button type="button" onClick={onReset} className="text-sm font-medium text-primary">
          Reset
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Gel polish, French tips..."
            className="w-full rounded-2xl border border-line bg-background px-4 py-3 outline-none transition focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-foreground">Category</label>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onCategoryChange("")}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${
                !filters.category
                  ? "bg-primary text-white"
                  : "bg-background text-foreground hover:bg-primary/10"
              }`}
            >
              All categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(String(category.id))}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${
                  filters.category === String(category.id)
                    ? "bg-primary text-white"
                    : "bg-background text-foreground hover:bg-primary/10"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Min price</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(event) => onPriceChange("minPrice", event.target.value)}
              placeholder="0"
              className="w-full rounded-2xl border border-line bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Max price</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(event) => onPriceChange("maxPrice", event.target.value)}
              placeholder="10000"
              className="w-full rounded-2xl border border-line bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Sort by</label>
          <select
            value={filters.sort}
            onChange={(event) => onSortChange(event.target.value)}
            className="w-full rounded-2xl border border-line bg-background px-4 py-3 outline-none transition focus:border-primary"
          >
            <option value="latest">Latest</option>
            <option value="priceAsc">Price: low to high</option>
            <option value="priceDesc">Price: high to low</option>
            <option value="nameAsc">Name: A-Z</option>
          </select>
        </div>
      </div>
    </aside>
  );
}

export default ProductFilters;
