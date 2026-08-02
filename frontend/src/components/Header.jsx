import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { FiLogOut, FiMenu, FiSearch, FiShoppingBag, FiUser, FiX } from "react-icons/fi";
import { PiPaintBrushBroad } from "react-icons/pi";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const links = [
  { name: "Home", to: "/" },
  { name: "Nail Services", to: "/products" },
  { name: "Nail Categories", to: "/categories" },
  { name: "Gallery", to: "/gallery" },
  { name: "Booking", to: "/booking" },
  { name: "Contact", to: "/contact" }
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-line/70 bg-surface/85 backdrop-blur-xl">
        <div className="section-shell flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl text-white shadow-glow">
              <PiPaintBrushBroad />
            </span>
            <div>
              <p className="font-display text-3xl leading-none text-primary sm:text-4xl">Glam Nail Studio</p>
              <p className="mt-1 hidden text-xs tracking-[0.3em] text-muted sm:block">PREMIUM NAIL STUDIO</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) =>
                  `relative py-2 text-sm font-medium transition ${
                    isActive ? "text-primary" : "text-foreground hover:text-primary"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    <span
                      className={`absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary transition ${
                        isActive ? "scale-100" : "scale-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/products"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-lg text-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              aria-label="Search products"
            >
              <FiSearch />
            </Link>
            <Link
              to={isAdmin ? "/admin/products" : isAuthenticated ? "/account/orders" : "/login"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-lg text-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              aria-label={isAdmin ? "Admin panel" : "Account"}
            >
              <FiUser />
            </Link>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-3 text-sm font-medium text-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <FiLogOut />
                {user?.name?.split(" ")[0] || "Logout"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-lg text-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              aria-label="Open cart"
            >
              <FiShoppingBag />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </button>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-lg text-foreground"
              aria-label="Open cart"
            >
              <FiShoppingBag />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-lg text-foreground"
              aria-label="Open navigation menu"
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#120f1f]/35 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: "-100%", borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", stiffness: 110, damping: 18 }}
              className="min-h-[72vh] rounded-b-[2rem] bg-surface shadow-2xl"
            >
              <div className="section-shell flex items-center justify-between py-6">
                <div>
                  <p className="font-display text-4xl text-primary">Glam Nail Studio</p>
                  <p className="mt-1 text-xs tracking-[0.35em] text-muted">NAILS, POLISHED</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-background text-lg text-foreground"
                  aria-label="Close navigation menu"
                >
                  <FiX />
                </button>
              </div>

              <div className="section-shell space-y-4 pb-10 pt-4">
                {links.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * index }}
                  >
                    <NavLink
                      to={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-[1.5rem] border px-5 py-4 text-lg font-medium transition ${
                          isActive
                            ? "border-primary bg-primary text-white"
                            : "border-line bg-background text-foreground"
                        }`
                      }
                    >
                      {link.name}
                      <span className="text-sm uppercase tracking-[0.3em]">0{index + 1}</span>
                    </NavLink>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="grid grid-cols-2 gap-3 pt-6"
                >
                  <Link
                    to="/products"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-[1.5rem] border border-line bg-background px-4 py-4 text-center font-medium text-foreground"
                  >
                    Nail Services
                  </Link>
                  <Link
                    to={isAdmin ? "/admin/products" : isAuthenticated ? "/account/orders" : "/login"}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-[1.5rem] bg-primary px-4 py-4 text-center font-medium text-white"
                  >
                    {isAdmin ? "Admin Panel" : isAuthenticated ? "My Orders" : "Sign In"}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
