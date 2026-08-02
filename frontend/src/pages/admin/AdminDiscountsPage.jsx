import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AdminShellHeader from "../../components/admin/AdminShellHeader";
import FormError from "../../components/forms/FormError";
import { useAuth } from "../../context/AuthContext";
import { applyDiscountToAllProducts, applyDiscountToProduct, fetchProducts } from "../../lib/api";
import { formatCurrency, getProductPricing } from "../../lib/formatters";

function AdminDiscountsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const singleForm = useForm({
    defaultValues: {
      productId: "",
      discountPercentage: ""
    }
  });
  const bulkForm = useForm({
    defaultValues: {
      discountPercentage: ""
    }
  });

  const loadProducts = async () => {
    const data = await fetchProducts({ includeInactive: "true", limit: 100 });
    setProducts(data.items);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === String(singleForm.watch("productId"))),
    [products, singleForm]
  );

  const applySingleDiscount = singleForm.handleSubmit(async (values) => {
    try {
      await applyDiscountToProduct(values.productId, Number(values.discountPercentage), token);
      toast.success("Product discount updated.");
      singleForm.reset({ ...values, discountPercentage: "" });
      await loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update product discount.");
    }
  });

  const applyBulkDiscount = bulkForm.handleSubmit(async (values) => {
    try {
      await applyDiscountToAllProducts(Number(values.discountPercentage), token);
      toast.success("Discount applied to all products.");
      bulkForm.reset({ discountPercentage: "" });
      await loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to apply bulk discount.");
    }
  });

  const pricing = selectedProduct ? getProductPricing(selectedProduct) : null;

  return (
    <div className="h-full overflow-y-auto pr-1">
      <AdminShellHeader
        eyebrow="Discounts"
        title="Discount Campaigns"
        description="The labels here explain what the old anonymous fields were trying to represent: original price, discount percentage, and resulting selling price."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={applySingleDiscount} className="glass-card rounded-[1.75rem] p-6">
          <h3 className="text-2xl font-semibold text-foreground">Discount one product</h3>
          <p className="mt-2 text-sm leading-7 text-muted">
            Choose a product, confirm its original price, then set the percentage discount to calculate the live selling price.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground">Product</label>
              <select
                {...singleForm.register("productId", {
                  required: "Please select a product"
                })}
                className="mt-2 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <FormError message={singleForm.formState.errors.productId?.message} />
            </div>

            {selectedProduct ? (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.5rem] border border-line bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Original Price</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">
                    {formatCurrency(pricing.originalPrice)}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-line bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Current Selling Price</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">
                    {formatCurrency(pricing.currentPrice)}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-line bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Current Discount</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">
                    {selectedProduct.discountPercentage || 0}%
                  </p>
                </div>
              </div>
            ) : null}

            <div>
              <label className="text-sm font-medium text-foreground">Discount Percentage</label>
              <input
                type="number"
                min="0"
                max="100"
                {...singleForm.register("discountPercentage", {
                  required: "Discount percentage is required",
                  min: { value: 0, message: "Discount cannot be negative" },
                  max: { value: 100, message: "Discount cannot exceed 100%" }
                })}
                className="mt-2 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
              <FormError message={singleForm.formState.errors.discountPercentage?.message} />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Apply Product Discount
          </button>
        </form>

        <form onSubmit={applyBulkDiscount} className="glass-card rounded-[1.75rem] p-6">
          <h3 className="text-2xl font-semibold text-foreground">Apply a store-wide discount</h3>
          <p className="mt-2 text-sm leading-7 text-muted">
            This action updates the discount percentage for every product while preserving each product’s original price.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground">Bulk Discount Percentage</label>
              <input
                type="number"
                min="0"
                max="100"
                {...bulkForm.register("discountPercentage", {
                  required: "Bulk discount percentage is required",
                  min: { value: 0, message: "Discount cannot be negative" },
                  max: { value: 100, message: "Discount cannot exceed 100%" }
                })}
                className="mt-2 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
              <FormError message={bulkForm.formState.errors.discountPercentage?.message} />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Add Discount To All Products
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminDiscountsPage;
