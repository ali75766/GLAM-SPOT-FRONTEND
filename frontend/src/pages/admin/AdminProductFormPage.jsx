import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdminShellHeader from "../../components/admin/AdminShellHeader";
import FormError from "../../components/forms/FormError";
import { useAuth } from "../../context/AuthContext";
import {
  createProduct,
  fetchCategories,
  fetchProductById,
  updateProduct,
  uploadImages
} from "../../lib/api";
import { formatCurrency } from "../../lib/formatters";

function AdminProductFormPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isEditMode = Boolean(productId);
  const [categories, setCategories] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: "",
      categoryId: "",
      shortDescription: "",
      description: "",
      basePrice: "",
      discountPercentage: 0,
      stock: "",
      badge: "",
      imageUrl: "",
      galleryUrls: "",
      localImages: null,
      featured: true,
      active: true
    }
  });

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    fetchProductById(productId).then((product) => {
      reset({
        name: product.name,
        categoryId: String(product.categoryId),
        shortDescription: product.shortDescription,
        description: product.description,
        basePrice: product.basePrice || product.compareAtPrice || product.price,
        discountPercentage: product.discountPercentage || 0,
        stock: product.stock,
        badge: product.badge || "",
        imageUrl: product.imageUrl || "",
        galleryUrls: product.gallery?.join(", ") || "",
        localImages: null,
        featured: Boolean(product.featured),
        active: Boolean(product.active)
      });
      setExistingGallery(product.gallery?.length ? product.gallery : [product.imageUrl]);
    });
  }, [productId, isEditMode, reset]);

  const basePrice = Number(watch("basePrice") || 0);
  const discountPercentage = Number(watch("discountPercentage") || 0);
  const computedSellingPrice = basePrice - (basePrice * discountPercentage) / 100;
  const localFiles = watch("localImages");

  const localPreviews = useMemo(
    () =>
      localFiles?.length
        ? Array.from(localFiles).map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file)
          }))
        : [],
    [localFiles]
  );

  const submit = handleSubmit(async (values) => {
    try {
      let gallery = values.galleryUrls
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      let imageUrl = values.imageUrl?.trim() || gallery[0] || existingGallery[0] || "";

      if (values.localImages?.length) {
        const uploads = await uploadImages(values.localImages, token);
        gallery = uploads.map((file) => file.url);
        imageUrl = gallery[0] || imageUrl;
      }

      if (!imageUrl) {
        toast.error("Add a product image URL or upload up to 3 local images.");
        return;
      }

      const payload = {
        name: values.name,
        categoryId: Number(values.categoryId),
        shortDescription: values.shortDescription,
        description: values.description,
        basePrice: Number(values.basePrice),
        discountPercentage: Number(values.discountPercentage || 0),
        stock: Number(values.stock),
        badge: values.badge,
        imageUrl,
        gallery: gallery.length ? gallery : [imageUrl],
        featured: values.featured,
        active: values.active
      };

      if (isEditMode) {
        await updateProduct(productId, payload, token);
        toast.success("Product updated.");
      } else {
        await createProduct(payload, token);
        toast.success("Product created.");
      }

      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save product.");
    }
  });

  return (
    <div className="h-full overflow-y-auto pr-1">
      <AdminShellHeader
        eyebrow={isEditMode ? "Edit product" : "Create product"}
        title={isEditMode ? "Update Product" : "Create Product"}
        description="The old anonymous number boxes are now explicit fields: Original Price, Discount Percentage, Available Stock, and a computed Current Selling Price."
        action={
          <Link
            to="/admin/products"
            className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-foreground"
          >
            Back to products
          </Link>
        }
      />

      <form onSubmit={submit} className="grid gap-8 xl:grid-cols-[1fr_380px]">
        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-foreground">Product Name</label>
              <input
                type="text"
                {...register("name", { required: "Product name is required" })}
                className="mt-2 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
              <FormError message={errors.name?.message} />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                {...register("categoryId", { required: "Category is required" })}
                className="mt-2 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <FormError message={errors.categoryId?.message} />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Badge Label</label>
              <input
                type="text"
                {...register("badge")}
                className="mt-2 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-foreground">Short Description</label>
              <input
                type="text"
                {...register("shortDescription", {
                  required: "Short description is required"
                })}
                className="mt-2 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
              <FormError message={errors.shortDescription?.message} />
            </div>

            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-foreground">Long Description</label>
              <textarea
                rows="6"
                {...register("description", { required: "Long description is required" })}
                className="mt-2 w-full rounded-[1.5rem] border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
              <FormError message={errors.description?.message} />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Original Price</label>
              <input
                type="number"
                step="0.01"
                {...register("basePrice", {
                  required: "Original price is required",
                  min: { value: 1, message: "Original price must be greater than 0" }
                })}
                className="mt-2 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
              <FormError message={errors.basePrice?.message} />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Discount Percentage</label>
              <input
                type="number"
                min="0"
                max="100"
                {...register("discountPercentage", {
                  required: "Discount percentage is required",
                  min: { value: 0, message: "Discount cannot be negative" },
                  max: { value: 100, message: "Discount cannot exceed 100%" }
                })}
                className="mt-2 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
              <FormError message={errors.discountPercentage?.message} />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Current Selling Price</label>
              <div className="mt-2 rounded-2xl border border-line bg-background px-5 py-4 text-base font-semibold text-foreground">
                {formatCurrency(computedSellingPrice > 0 ? computedSellingPrice : 0)}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Available Stock</label>
              <input
                type="number"
                {...register("stock", {
                  required: "Stock is required",
                  min: { value: 0, message: "Stock cannot be negative" }
                })}
                className="mt-2 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
              <FormError message={errors.stock?.message} />
            </div>

            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-foreground">Primary Image URL</label>
              <input
                type="text"
                {...register("imageUrl")}
                className="mt-2 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-foreground">Additional Gallery URLs</label>
              <textarea
                rows="3"
                {...register("galleryUrls")}
                className="mt-2 w-full rounded-[1.5rem] border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
              <p className="mt-2 text-xs leading-6 text-muted">
                Optional comma-separated image URLs. Local uploads below can replace these if selected.
              </p>
            </div>

            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-foreground">Local Product Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                {...register("localImages", {
                  validate: {
                    maxThree: (files) =>
                      !files || files.length <= 3 || "You can upload a maximum of 3 images",
                    imageOnly: (files) =>
                      !files ||
                      Array.from(files).every((file) => file.type.startsWith("image/")) ||
                      "Only image files are allowed"
                  }
                })}
                className="mt-2 w-full rounded-2xl border border-line bg-background px-5 py-4 text-sm outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-medium file:text-primary focus:border-primary"
              />
              <FormError message={errors.localImages?.message} />
              <p className="mt-2 text-xs leading-6 text-muted">
                Local upload limit: 3 images. These are sent through the backend `multer` upload route.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 lg:col-span-2">
              <label className="flex items-center gap-3 text-sm font-medium text-foreground">
                <input type="checkbox" {...register("featured")} />
                Feature this product on storefront sections
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-foreground">
                <input type="checkbox" {...register("active")} />
                Keep this product visible in the catalog
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
          </button>
        </div>

        <aside className="space-y-5">
          <div className="glass-card rounded-[1.75rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Image Preview</p>
            <div className="mt-4 grid gap-3">
              {(localPreviews.length
                ? localPreviews
                : existingGallery.length
                  ? existingGallery.map((url) => ({ name: url, url }))
                  : watch("imageUrl")
                    ? [{ name: watch("imageUrl"), url: watch("imageUrl") }]
                    : [{ name: "placeholder", url: "https://placehold.co/800x600/f8d7e3/2d2438?text=Product+Preview" }]).map((file) => (
                <img key={file.name} src={file.url} alt={file.name} className="h-48 w-full rounded-[1.5rem] object-cover" />
              ))}
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

export default AdminProductFormPage;
