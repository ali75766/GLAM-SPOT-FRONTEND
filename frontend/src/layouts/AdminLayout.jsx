import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminLoginScreen from "../components/admin/AdminLoginScreen";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  if (!isAuthenticated) {
    return <AdminLoginScreen />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background px-4 py-10">
        <div className="mx-auto max-w-3xl glass-card rounded-[2rem] p-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-primary">Restricted area</p>
          <h1 className="mt-4 text-4xl font-semibold text-foreground">Admin access required</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            This workspace is only for admin accounts. Customer sessions should use the storefront and the order history page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-background p-4 lg:p-6">
      <div className="mx-auto grid h-full max-w-[1680px] gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <AdminSidebar />

        <div className="glass-card flex h-full min-h-0 flex-col overflow-hidden rounded-[2rem] p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 border-b border-line pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Admin panel</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">{user?.name}</h2>
              <p className="mt-2 text-sm text-muted">
                {location.pathname.replace("/admin/", "").replaceAll("/", " / ") || "products"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  logout();
                  toast.success("Admin logged out.");
                  navigate("/");
                }}
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-3 text-sm font-medium text-foreground"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
