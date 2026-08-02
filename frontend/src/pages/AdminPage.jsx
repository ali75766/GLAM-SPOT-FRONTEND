import { useEffect, useState } from "react";
import {
  FiBox,
  FiEye,
  FiLayers,
  FiPercent,
  FiShoppingBag,
  FiTag
} from "react-icons/fi";
import PageIntro from "../components/PageIntro";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import {
  applyDiscountToAllProducts,
  applyDiscountToProduct,
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  fetchCategories,
  fetchOrders,
  fetchProducts,
  loginAdmin,
  updateCategory,
  updateProduct
} from "../lib/api";
import { formatCurrency, formatShortDate, getProductPricing } from "../lib/formatters";

const tabs = [
  { key: "categories", label: "Categories", icon: FiLayers },
  { key: "products", label: "Products", icon: FiShoppingBag },
  { key: "discounts", label: "Discounts", icon: FiPercent },
  { key: "orders", label: "Orders", icon: FiBox }
];

const emptyCategory = {
  id: null,
  name: "",
  description: "",
  imageUrl: "",
  featured: true
};

const emptyProduct = {
  id: null,
  name: "",
  categoryId: "",
  shortDescription: "",
  description: "",
  price: "",
  compareAtPrice: "",
  stock: "",
  imageUrl: "",
  gallery: "",
  badge: "",
  featured: true,
  active: true
};

function AdminPage() {
  const { token, user, login, logout, isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("categories");
  const [authForm, setAuthForm] = useState({ email: "admin@glamspot.pk", password: "Admin@123" });
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [discountForm, setDiscountForm] = useState({
    productId: "",
    productDiscount: "",
    bulkDiscount: ""
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const setMessage = (type, message) => {
    if (type === "error") {
      setError(message);
      setNotice("");
      return;
    }

    setNotice(message);
    setError("");
  };

  const loadDashboard = async (sessionToken = token) => {
    const [categoryData, productData, orderData] = await Promise.all([
      fetchCategories(),
      fetchProducts({ limit: 100, includeInactive: "true" }),
      sessionToken ? fetchOrders(sessionToken) : Promise.resolve([])
    ]);

    setCategories(categoryData);
    setProducts(productData.items);
    setOrders(orderData);
  };

  useEffect(() => {
    loadDashboard();
  }, [token]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const data = await loginAdmin(authForm);
      login(data);
      setMessage("notice", "Admin session started.");
    } catch (apiError) {
      setMessage("error", apiError.response?.data?.message || "Unable to sign in.");
    }
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        name: categoryForm.name,
        description: categoryForm.description,
        imageUrl: categoryForm.imageUrl,
        featured: categoryForm.featured
      };

      if (categoryForm.id) {
        await updateCategory(categoryForm.id, payload, token);
        setMessage("notice", "Category updated.");
      } else {
        await createCategory(payload, token);
        setMessage("notice", "Category created.");
      }

      setCategoryForm(emptyCategory);
      await loadDashboard();
    } catch (apiError) {
      setMessage("error", apiError.response?.data?.message || "Unable to save category.");
    }
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        name: productForm.name,
        categoryId: Number(productForm.categoryId),
        shortDescription: productForm.shortDescription,
        description: productForm.description,
        price: Number(productForm.price),
        compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : null,
        stock: Number(productForm.stock),
        imageUrl: productForm.imageUrl,
        gallery: productForm.gallery
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        badge: productForm.badge,
        featured: productForm.featured,
        active: productForm.active
      };

      if (productForm.id) {
        await updateProduct(productForm.id, payload, token);
        setMessage("notice", "Product updated.");
      } else {
        await createProduct(payload, token);
        setMessage("notice", "Product created.");
      }

      setProductForm(emptyProduct);
      await loadDashboard();
    } catch (apiError) {
      setMessage("error", apiError.response?.data?.message || "Unable to save product.");
    }
  };

  const handleSingleDiscount = async (event) => {
    event.preventDefault();

    try {
      await applyDiscountToProduct(
        discountForm.productId,
        Number(discountForm.productDiscount),
        token
      );
      setDiscountForm((current) => ({ ...current, productDiscount: "" }));
      setMessage("notice", "Discount applied to selected product.");
      await loadDashboard();
    } catch (apiError) {
      setMessage("error", apiError.response?.data?.message || "Unable to apply product discount.");
    }
  };

  const handleBulkDiscount = async (event) => {
    event.preventDefault();

    try {
      await applyDiscountToAllProducts(Number(discountForm.bulkDiscount), token);
      setDiscountForm((current) => ({ ...current, bulkDiscount: "" }));
      setMessage("notice", "Discount applied to all products.");
      await loadDashboard();
    } catch (apiError) {
      setMessage("error", apiError.response?.data?.message || "Unable to apply bulk discount.");
    }
  };

  const beginCategoryEdit = (category) => {
    setTab("categories");
    setCategoryForm({
      id: category.id,
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      featured: Boolean(category.featured)
    });
  };

  const beginProductEdit = (product) => {
    setTab("products");
    setProductForm({
      id: product.id,
      name: product.name,
      categoryId: String(product.categoryId),
      shortDescription: product.shortDescription,
      description: product.description,
      price: String(product.price),
      compareAtPrice: product.basePrice ? String(product.basePrice) : "",
      stock: String(product.stock),
      imageUrl: product.imageUrl,
      gallery: product.gallery?.join(", ") || "",
      badge: product.badge || "",
      featured: Boolean(product.featured),
      active: Boolean(product.active)
    });
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id, token);
      setMessage("notice", "Category deleted.");
      await loadDashboard();
    } catch (apiError) {
      setMessage("error", apiError.response?.data?.message || "Unable to delete category.");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id, token);
      setMessage("notice", "Product deleted.");
      await loadDashboard();
    } catch (apiError) {
      setMessage("error", apiError.response?.data?.message || "Unable to delete product.");
    }
  };

  const selectedDiscountProduct = products.find(
    (product) => String(product.id) === String(discountForm.productId)
  );

  return (
    <>
      <PageIntro
        eyebrow="Admin panel"
        title="Catalog management, discount controls and read-only order previews"
        copy="Categories and products remain editable, while orders stay readable only with quick modal-based previews."
      />

      <section className="section-shell py-16">
        {!token ? (
          <div className="mx-auto max-w-xl glass-card rounded-[2rem] p-8">
            <h2 className="text-3xl font-semibold text-foreground">Admin sign in</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Default seeded credentials are already filled in for fast testing.
            </p>
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <input
                type="email"
                value={authForm.email}
                onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
              <input
                type="password"
                value={authForm.password}
                onChange={(event) =>
                  setAuthForm((current) => ({ ...current, password: event.target.value }))
                }
                className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
              {error ? <p className="text-sm font-medium text-red-500">{error}</p> : null}
              <button type="submit" className="rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white">
                Sign in
              </button>
            </form>
          </div>
        ) : !isAdmin ? (
          <div className="mx-auto max-w-2xl glass-card rounded-[2rem] p-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Restricted area</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">Admin access required</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              This dashboard is only for admin users. Customer accounts can sign in and checkout, but cannot manage the catalog.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[280px_1fr]">
            <aside className="glass-card h-fit rounded-[2rem] p-5">
              <div className="border-b border-line pb-5">
                <p className="text-sm uppercase tracking-[0.3em] text-primary">Signed in</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">{user?.name}</h2>
                <p className="mt-2 text-sm leading-7 text-muted">
                  {categories.length} categories, {products.length} products and {orders.length} orders loaded.
                </p>
              </div>

              <div className="mt-5 space-y-2">
                {tabs.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTab(item.key)}
                      className={`flex w-full items-center gap-3 rounded-[1.25rem] px-4 py-3 text-left text-sm font-semibold transition ${
                        tab === item.key
                          ? "bg-primary text-white"
                          : "bg-background text-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      <Icon />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={logout}
                className="mt-6 w-full rounded-[1.25rem] border border-line px-4 py-3 text-sm font-semibold text-foreground"
              >
                Sign out
              </button>
            </aside>

            <div className="space-y-6">
              {notice ? <p className="text-sm font-medium text-primary">{notice}</p> : null}
              {error ? <p className="text-sm font-medium text-red-500">{error}</p> : null}

              {tab === "categories" ? (
                <div className="grid gap-8 2xl:grid-cols-[0.95fr_1.05fr]">
                  <form onSubmit={handleCategorySubmit} className="glass-card rounded-[2rem] p-6">
                    <h3 className="text-2xl font-semibold text-foreground">
                      {categoryForm.id ? "Edit category" : "Create category"}
                    </h3>
                    <div className="mt-5 space-y-4">
                      <input
                        type="text"
                        placeholder="Category name"
                        value={categoryForm.name}
                        onChange={(event) =>
                          setCategoryForm((current) => ({ ...current, name: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                      />
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={categoryForm.imageUrl}
                        onChange={(event) =>
                          setCategoryForm((current) => ({ ...current, imageUrl: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                      />
                      <textarea
                        rows="4"
                        placeholder="Description"
                        value={categoryForm.description}
                        onChange={(event) =>
                          setCategoryForm((current) => ({ ...current, description: event.target.value }))
                        }
                        className="w-full rounded-[1.5rem] border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                      />
                      <label className="flex items-center gap-3 text-sm font-medium text-foreground">
                        <input
                          type="checkbox"
                          checked={categoryForm.featured}
                          onChange={(event) =>
                            setCategoryForm((current) => ({ ...current, featured: event.target.checked }))
                          }
                        />
                        Featured category
                      </label>
                      <div className="flex gap-3">
                        <button type="submit" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
                          Save category
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryForm(emptyCategory)}
                          className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-foreground"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div key={category.id} className="glass-card flex flex-col gap-4 rounded-[1.75rem] p-5 lg:flex-row">
                        <img src={category.imageUrl} alt={category.name} className="h-28 w-full rounded-2xl object-cover lg:w-32" />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
                          <p className="mt-2 text-sm leading-7 text-muted">{category.description}</p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => beginCategoryEdit(category)}
                            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-foreground"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {tab === "products" ? (
                <div className="grid gap-8 2xl:grid-cols-[0.95fr_1.05fr]">
                  <form onSubmit={handleProductSubmit} className="glass-card rounded-[2rem] p-6">
                    <h3 className="text-2xl font-semibold text-foreground">
                      {productForm.id ? "Edit product" : "Create product"}
                    </h3>
                    <div className="mt-5 grid gap-4">
                      <input
                        type="text"
                        placeholder="Product name"
                        value={productForm.name}
                        onChange={(event) =>
                          setProductForm((current) => ({ ...current, name: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                      />
                      <select
                        value={productForm.categoryId}
                        onChange={(event) =>
                          setProductForm((current) => ({ ...current, categoryId: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Short description"
                        value={productForm.shortDescription}
                        onChange={(event) =>
                          setProductForm((current) => ({
                            ...current,
                            shortDescription: event.target.value
                          }))
                        }
                        className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                      />
                      <textarea
                        rows="4"
                        placeholder="Description"
                        value={productForm.description}
                        onChange={(event) =>
                          setProductForm((current) => ({ ...current, description: event.target.value }))
                        }
                        className="w-full rounded-[1.5rem] border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                      />
                      <div className="grid gap-4 sm:grid-cols-3">
                        <input
                          type="number"
                          placeholder="Current price"
                          value={productForm.price}
                          onChange={(event) =>
                            setProductForm((current) => ({ ...current, price: event.target.value }))
                          }
                          className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                        />
                        <input
                          type="number"
                          placeholder="Original price"
                          value={productForm.compareAtPrice}
                          onChange={(event) =>
                            setProductForm((current) => ({
                              ...current,
                              compareAtPrice: event.target.value
                            }))
                          }
                          className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                        />
                        <input
                          type="number"
                          placeholder="Stock"
                          value={productForm.stock}
                          onChange={(event) =>
                            setProductForm((current) => ({ ...current, stock: event.target.value }))
                          }
                          className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={productForm.imageUrl}
                        onChange={(event) =>
                          setProductForm((current) => ({ ...current, imageUrl: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                      />
                      <input
                        type="text"
                        placeholder="Gallery URLs separated by commas"
                        value={productForm.gallery}
                        onChange={(event) =>
                          setProductForm((current) => ({ ...current, gallery: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                      />
                      <input
                        type="text"
                        placeholder="Badge"
                        value={productForm.badge}
                        onChange={(event) =>
                          setProductForm((current) => ({ ...current, badge: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                      />
                      <div className="flex flex-wrap gap-5">
                        <label className="flex items-center gap-3 text-sm font-medium text-foreground">
                          <input
                            type="checkbox"
                            checked={productForm.featured}
                            onChange={(event) =>
                              setProductForm((current) => ({ ...current, featured: event.target.checked }))
                            }
                          />
                          Featured
                        </label>
                        <label className="flex items-center gap-3 text-sm font-medium text-foreground">
                          <input
                            type="checkbox"
                            checked={productForm.active}
                            onChange={(event) =>
                              setProductForm((current) => ({ ...current, active: event.target.checked }))
                            }
                          />
                          Active
                        </label>
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
                          Save product
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductForm(emptyProduct)}
                          className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-foreground"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="space-y-4">
                    {products.map((product) => {
                      const pricing = getProductPricing(product);

                      return (
                        <div key={product.id} className="glass-card flex flex-col gap-4 rounded-[1.75rem] p-5 lg:flex-row">
                          <img src={product.imageUrl} alt={product.name} className="h-28 w-full rounded-2xl object-cover lg:w-32" />
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
                            <p className="mt-2 text-sm leading-7 text-muted">{product.shortDescription}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              <span className="text-sm font-semibold text-foreground">
                                {formatCurrency(pricing.currentPrice)}
                              </span>
                              {pricing.hasDiscount ? (
                                <>
                                  <span className="text-sm text-red-500 line-through decoration-2 decoration-red-500">
                                    {formatCurrency(pricing.originalPrice)}
                                  </span>
                                  <span className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-600">
                                    New price
                                  </span>
                                </>
                              ) : null}
                            </div>
                            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-primary">
                              {product.category?.name}
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => beginProductEdit(product)}
                              className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-foreground"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {tab === "discounts" ? (
                <div className="grid gap-8 xl:grid-cols-2">
                  <form onSubmit={handleSingleDiscount} className="glass-card rounded-[2rem] p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl text-primary">
                        <FiTag />
                      </span>
                      <div>
                        <h3 className="text-2xl font-semibold text-foreground">Discount a single product</h3>
                        <p className="mt-1 text-sm text-muted">
                          Select any product from the dropdown and apply an integer percentage.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <select
                        value={discountForm.productId}
                        onChange={(event) =>
                          setDiscountForm((current) => ({ ...current, productId: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                      >
                        <option value="">Select product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Discount percentage"
                        value={discountForm.productDiscount}
                        onChange={(event) =>
                          setDiscountForm((current) => ({
                            ...current,
                            productDiscount: event.target.value
                          }))
                        }
                        className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                      />

                      <button
                        type="submit"
                        disabled={!discountForm.productId}
                        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        Apply product discount
                      </button>
                    </div>

                    {selectedDiscountProduct ? (
                      <div className="mt-6 rounded-[1.5rem] border border-line bg-background p-5">
                        <p className="text-sm uppercase tracking-[0.25em] text-primary">Selected product</p>
                        <h4 className="mt-2 text-xl font-semibold text-foreground">
                          {selectedDiscountProduct.name}
                        </h4>
                        <p className="mt-2 text-sm text-muted">
                          Current discount: {selectedDiscountProduct.discountPercentage || 0}%
                        </p>
                      </div>
                    ) : null}
                  </form>

                  <form onSubmit={handleBulkDiscount} className="glass-card rounded-[2rem] p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl text-primary">
                        <FiPercent />
                      </span>
                      <div>
                        <h3 className="text-2xl font-semibold text-foreground">Add discount to all products</h3>
                        <p className="mt-1 text-sm text-muted">
                          Apply one consistent promotional percentage across the full catalog.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Bulk discount percentage"
                        value={discountForm.bulkDiscount}
                        onChange={(event) =>
                          setDiscountForm((current) => ({
                            ...current,
                            bulkDiscount: event.target.value
                          }))
                        }
                        className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                      />
                      <button
                        type="submit"
                        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
                      >
                        Add discount to all products
                      </button>
                    </div>

                    <div className="mt-6 rounded-[1.5rem] border border-line bg-background p-5">
                      <p className="text-sm leading-7 text-muted">
                        Bulk discounts reuse each product's original stored price, so the promotion stays clean instead of compounding on itself.
                      </p>
                    </div>
                  </form>
                </div>
              ) : null}

              {tab === "orders" ? (
                <div className="glass-card overflow-hidden rounded-[2rem]">
                  <div className="border-b border-line px-6 py-5">
                    <h3 className="text-2xl font-semibold text-foreground">Orders listing</h3>
                    <p className="mt-2 text-sm text-muted">
                      Orders are intentionally read-only. Use the action icon to preview full details in a modal.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead className="bg-background/70 text-xs uppercase tracking-[0.24em] text-muted">
                        <tr>
                          <th className="px-6 py-4">Order</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Items</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Total</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-t border-line/70">
                            <td className="px-6 py-5 font-semibold text-foreground">{order.orderNumber}</td>
                            <td className="px-6 py-5">
                              <p className="font-medium text-foreground">{order.customerName}</p>
                              <p className="mt-1 text-sm text-muted">{order.customerEmail}</p>
                            </td>
                            <td className="px-6 py-5 text-sm text-foreground">{order.items?.length || 0}</td>
                            <td className="px-6 py-5">
                              <span className="rounded-full bg-primary/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-5 font-medium text-foreground">{formatCurrency(order.total)}</td>
                            <td className="px-6 py-5 text-sm text-muted">{formatShortDate(order.createdAt)}</td>
                            <td className="px-6 py-5">
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-background text-foreground transition hover:border-primary hover:text-primary"
                                aria-label={`Preview ${order.orderNumber}`}
                              >
                                <FiEye />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </section>

      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order Preview • ${selectedOrder.orderNumber}` : "Order Preview"}
      >
        {selectedOrder ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-line bg-background p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-primary">Customer</p>
                <h4 className="mt-2 text-xl font-semibold text-foreground">{selectedOrder.customerName}</h4>
                <p className="mt-2 text-sm text-muted">{selectedOrder.customerEmail}</p>
                <p className="mt-1 text-sm text-muted">{selectedOrder.phone}</p>
              </div>
              <div className="rounded-[1.5rem] border border-line bg-background p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-primary">Delivery</p>
                <h4 className="mt-2 text-xl font-semibold text-foreground">{selectedOrder.city}</h4>
                <p className="mt-2 text-sm leading-7 text-muted">{selectedOrder.address}</p>
                <p className="mt-2 text-sm text-muted">{selectedOrder.paymentMethod}</p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-line bg-background p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-primary">Summary</p>
                  <h4 className="mt-2 text-xl font-semibold text-foreground">{selectedOrder.status}</h4>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted">Subtotal: {formatCurrency(selectedOrder.subtotal)}</p>
                  <p className="mt-1 text-sm text-muted">
                    Discount: {formatCurrency(selectedOrder.discountAmount)}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-foreground">
                    Total: {formatCurrency(selectedOrder.total)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {selectedOrder.items?.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="flex gap-4 rounded-[1.5rem] border border-line bg-background p-4">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
                  ) : null}
                  <div className="flex-1">
                    <h5 className="text-lg font-semibold text-foreground">{item.name}</h5>
                    <p className="mt-1 text-sm text-muted">Quantity: {item.quantity}</p>
                    <p className="mt-1 text-sm text-muted">Unit price: {formatCurrency(item.unitPrice)}</p>
                  </div>
                </div>
              ))}
            </div>

            {selectedOrder.notes ? (
              <div className="rounded-[1.5rem] border border-line bg-background p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-primary">Notes</p>
                <p className="mt-2 text-sm leading-7 text-muted">{selectedOrder.notes}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </>
  );
}

export default AdminPage;
