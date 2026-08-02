import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdminShellHeader from "../../components/admin/AdminShellHeader";
import FormError from "../../components/forms/FormError";
import { useAuth } from "../../context/AuthContext";
import {
  createCategory,
  fetchCategoryById,
  updateCategory,
  uploadImages
} from "../../lib/api";

function AdminCategoryFormPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isEditMode = Boolean(categoryId);
  const [existingImage, setExistingImage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      featured: true,
      localImages: null
    }
  });

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    fetchCategoryById(categoryId).then((category) => {
      reset({
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        featured: Boolean(category.featured),
        localImages: null
      });
      setExistingImage(category.imageUrl);
    });
  }, [categoryId, isEditMode, reset]);

  const localFiles = watch("localImages");
  const localFilesPreview = useMemo(
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
      let imageUrl = values.imageUrl?.trim() || existingImage;

      if (values.localImages?.length) {
        const uploads = await uploadImages(values.localImages, token);
        imageUrl = uploads[0]?.url || imageUrl;
      }

      if (!imageUrl) {
        toast.error("Add either a cover image URL or one local image.");
        return;
      }

      const payload = {
        name: values.name,
        description: values.description,
        imageUrl,
        featured: values.featured
      };

      if (isEditMode) {
        await updateCategory(categoryId, payload, token);
        toast.success("Category updated.");
      } else {
        await createCategory(payload, token);
        toast.success("Category created.");
      }

      navigate("/admin/categories");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save category.");
    }
  });

  return (
    <div className="h-full overflow-y-auto pr-1">
      <AdminShellHeader
        eyebrow={isEditMode ? "Edit category" : "Create category"}
        title={isEditMode ? "Update Category" : "Create Category"}
        description="Cover every field with a proper label. If you attach local images, the backend upload accepts up to three files but category cover uses the first one."
        action={
          <Link
            to="/admin/categories"
            className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-foreground"
          >
            Back to categories
          </Link>
        }
      />

      <form onSubmit={submit} className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground">Category Name</label>
              <input
                type="text"
                {...register("name", { required: "Category name is required" })}
                className="mt-2 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
              <FormError message={errors.name?.message} />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                rows="6"
                {...register("description", { required: "Description is required" })}
                className="mt-2 w-full rounded-[1.5rem] border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
              <FormError message={errors.description?.message} />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Cover Image URL</label>
              <input
                type="text"
                {...register("imageUrl")}
                className="mt-2 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
              <p className="mt-2 text-xs leading-6 text-muted">
                You can keep a hosted image URL here, or upload local images below.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Local Images Upload</label>
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
            </div>

            <label className="flex items-center gap-3 text-sm font-medium text-foreground">
              <input type="checkbox" {...register("featured")} />
              Mark this category as featured
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : isEditMode ? "Update Category" : "Create Category"}
          </button>
        </div>

        <aside className="space-y-5">
          <div className="glass-card rounded-[1.75rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Current Cover</p>
            <img
              src={localFilesPreview[0]?.url || watch("imageUrl") || existingImage || "https://placehold.co/800x600/f8d7e3/2d2438?text=Category+Preview"}
              alt="Category preview"
              className="mt-4 h-64 w-full rounded-[1.5rem] object-cover"
            />
          </div>

          {localFilesPreview.length ? (
            <div className="glass-card rounded-[1.75rem] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Selected Local Images</p>
              <div className="mt-4 grid gap-3">
                {localFilesPreview.map((file) => (
                  <div key={file.name} className="flex items-center gap-3 rounded-2xl border border-line bg-background p-3">
                    <img src={file.url} alt={file.name} className="h-14 w-14 rounded-xl object-cover" />
                    <p className="text-sm text-foreground">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </form>
    </div>
  );
}

export default AdminCategoryFormPage;
