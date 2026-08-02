import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import AdminShellHeader from "../../components/admin/AdminShellHeader";
import { useAuth } from "../../context/AuthContext";
import { deleteCategory, fetchCategories } from "../../lib/api";

function AdminCategoriesListPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const removeCategory = async (category) => {
    if (!window.confirm(`Delete ${category.name}?`)) {
      return;
    }

    try {
      await deleteCategory(category.id, token);
      toast.success("Category deleted.");
      await loadCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete category.");
    }
  };

  return (
    <div className="h-full overflow-y-auto pr-1">
      <AdminShellHeader
        eyebrow="Categories"
        title="Category Library"
        description="Each category opens its own create and edit page, with clearer labels than the old mixed panel and a proper cover image workflow."
        action={
          <Link
            to="/admin/categories/new"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Add Category
          </Link>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="glass-card rounded-[1.75rem] p-5">
            <img
              src={category.imageUrl}
              alt={category.name}
              className="h-48 w-full rounded-[1.5rem] object-cover"
            />
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-foreground">{category.name}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{category.description}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {category.productCount} linked products
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to={`/admin/categories/${category.id}/edit`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-background text-foreground transition hover:border-primary hover:text-primary"
                  aria-label={`Edit ${category.name}`}
                >
                  <FiEdit2 />
                </Link>
                <button
                  type="button"
                  onClick={() => removeCategory(category)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-background text-foreground transition hover:border-red-400 hover:text-red-500"
                  aria-label={`Delete ${category.name}`}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCategoriesListPage;
