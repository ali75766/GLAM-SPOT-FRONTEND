import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormError from "../forms/FormError";
import { useAuth } from "../../context/AuthContext";
import { loginAdmin } from "../../lib/api";

function AdminLoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: "admin@glamspot.pk",
      password: "Admin@123"
    }
  });

  const submit = handleSubmit(async (values) => {
    try {
      const data = await loginAdmin(values);

      if (data.user.role !== "admin") {
        toast.error("This account does not have admin access.");
        return;
      }

      login(data);
      toast.success("Admin login successful.");
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Wrong credentials.");
    }
  });

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-card flex flex-col justify-between rounded-[2rem] p-8 lg:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-primary">Admin access</p>
            <h1 className="mt-4 font-display text-6xl leading-[0.92] text-foreground">
              Sign in to manage Glam Nail Studio products, categories, discounts and orders
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted">
              This studio admin area is separate from the storefront and each sidebar section opens as its own full-page workspace.
            </p>
          </div>
          <div className="mt-8 rounded-[1.75rem] border border-line bg-background p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-primary">Seeded admin account</p>
            <p className="mt-3 text-sm text-muted">Email: admin@glamspot.pk</p>
            <p className="mt-1 text-sm text-muted">Password: Admin@123</p>
          </div>
        </div>

        <form onSubmit={submit} className="glass-card flex items-center rounded-[2rem] p-8 lg:p-12">
          <div className="w-full">
            <h2 className="text-3xl font-semibold text-foreground">Admin Login</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Successful login sends you directly into the admin panel.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground">Admin Email</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Admin email is required"
                  })}
                  className="mt-2 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                />
                <FormError message={errors.email?.message} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Password</label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required"
                  })}
                  className="mt-2 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                />
                <FormError message={errors.password?.message} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Open admin panel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginScreen;
