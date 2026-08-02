import { AnimatePresence, motion } from "framer-motion";
import { FiMinus, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../lib/formatters";

function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, subtotal, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const { isAuthenticated } = useAuth();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-50 bg-[#140f23]/35 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            className="fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col bg-surface p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-primary">Your cart</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">Nail bag</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-lg text-foreground"
              >
                <FiX />
              </button>
            </div>

            <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
              {items.length === 0 ? (
                <div className="glass-card rounded-[1.75rem] p-6 text-center">
                  <p className="text-lg font-semibold text-foreground">Your cart is empty.</p>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    Add products from any page and they will appear here instantly.
                  </p>
                  <Link
                    to="/products"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
                  >
                    Explore nail products
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="glass-card rounded-[1.5rem] p-4">
                    <div className="flex gap-4">
                      <img src={item.imageUrl} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
                        <p className="mt-1 text-sm text-muted">{formatCurrency(item.price)}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-line px-3 py-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-foreground"
                            >
                              <FiMinus />
                            </button>
                            <span className="min-w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-foreground"
                            >
                              <FiPlus />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-primary"
                            aria-label={`Remove ${item.name}`}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-line bg-background p-5">
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span className="text-lg font-semibold text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              <p className="mt-3 text-xs leading-6 text-muted">
                {isAuthenticated
                  ? "Your checkout is ready. Place the order from the protected checkout page."
                  : "Sign in or create an account before placing your order."}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={clearCart}
                  className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-foreground"
                >
                  Clear cart
                </button>
                <Link
                  to={isAuthenticated ? "/checkout" : "/login?redirect=/checkout"}
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  {isAuthenticated ? "Checkout" : "Sign in to checkout"}
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
