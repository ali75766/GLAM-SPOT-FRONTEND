import { NavLink } from "react-router-dom";
import { FiBox, FiCalendar, FiGrid, FiPackage, FiPercent, FiTag } from "react-icons/fi";

const links = [
  {
    to: "/admin/products",
    label: "Products",
    description: "Manage nail products",
    icon: FiPackage
  },
  {
    to: "/admin/categories",
    label: "Categories",
    description: "Organize nail groups",
    icon: FiGrid
  },
  {
    to: "/admin/discounts",
    label: "Discounts",
    description: "Apply product promotions",
    icon: FiPercent
  },
  {
    to: "/admin/bookings",
    label: "Bookings",
    description: "View appointment requests",
    icon: FiCalendar
  },
  {
    to: "/admin/orders",
    label: "Orders",
    description: "Read-only order history",
    icon: FiBox
  }
];

function AdminSidebar() {
  return (
    <aside className="glass-card min-h-0 rounded-[2rem] p-5 xl:h-full xl:overflow-y-auto">
      <div className="border-b border-line pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl text-primary">
            <FiTag />
          </span>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Admin workspace</p>
            <h2 className="mt-1 text-2xl font-semibold text-foreground">Glam Nail Studio Control</h2>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block rounded-[1.5rem] border px-4 py-4 transition ${
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-background text-foreground hover:border-primary/40 hover:bg-primary/5"
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl ${
                      isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon />
                  </span>
                  <div>
                    <p className="text-base font-semibold">{link.label}</p>
                    <p className={`mt-1 text-sm ${isActive ? "text-white/75" : "text-muted"}`}>
                      {link.description}
                    </p>
                  </div>
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}

export default AdminSidebar;
