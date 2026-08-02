import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import AdminShellHeader from "../../components/admin/AdminShellHeader";
import { useAuth } from "../../context/AuthContext";
import { deleteProduct, fetchProducts } from "../../lib/api";
import { formatCurrency, getProductPricing } from "../../lib/formatters";

function AdminProductsListPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const data = await fetchProducts({ includeInactive: "true", limit: 100 });
    setProducts(data.items);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const removeProduct = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) {
      return;
    }

    try {
      await deleteProduct(product.id, token);
      toast.success("Product deleted.");
      await loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete product.");
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <AdminShellHeader
        eyebrow="Products"
        title="Product Catalog"
        description="Manage every product in a clear full-page table. Edit opens a dedicated page with prefilled values, labeled pricing fields, validation, and upload support."
        action={
          <Link
            to="/admin/products/new"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Add Product
          </Link>
        }
      />

      <div className="min-h-0 flex-1 overflow-hidden rounded-[1.75rem] border border-line">
        <div className="h-full overflow-auto">
          <table className="min-w-full text-left">
            <thead className="bg-background text-xs uppercase tracking-[0.22em] text-muted">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Original Price</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Selling Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const pricing = getProductPricing(product);

                return (
                  <tr key={product.id} className="border-t border-line/70 align-top">
                    <td className="px-6 py-5">
                      <div className="flex min-w-[260px] gap-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-16 w-16 rounded-2xl object-cover"
                        />
                        <div>
                          <p className="font-semibold text-foreground">{product.name}</p>
                          <p className="mt-1 max-w-sm text-sm text-muted">{product.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-foreground">{product.category?.name}</td>
                    <td className="px-6 py-5 text-sm text-foreground">
                      {formatCurrency(pricing.originalPrice)}
                    </td>
                    <td className="px-6 py-5 text-sm text-foreground">
                      {product.discountPercentage || 0}%
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-foreground">
                      {formatCurrency(pricing.currentPrice)}
                    </td>
                    <td className="px-6 py-5 text-sm text-foreground">{product.stock}</td>
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                          product.active
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {product.active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-background text-foreground transition hover:border-primary hover:text-primary"
                          aria-label={`Edit ${product.name}`}
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeProduct(product)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-background text-foreground transition hover:border-red-400 hover:text-red-500"
                          aria-label={`Delete ${product.name}`}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminProductsListPage;
