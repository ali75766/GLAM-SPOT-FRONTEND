import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { formatCurrency, getProductPricing } from "../lib/formatters";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { currentPrice, originalPrice, discount, hasDiscount } = getProductPricing(product);

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="glass-card group overflow-hidden rounded-[1.75rem]"
    >
      <Link to={`/products/${product.slug || product.id}`} className="relative block overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          {product.badge ? (
            <span className="rounded-full bg-[#140f23]/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur">
              {product.badge}
            </span>
          ) : (
            <span />
          )}
          {discount ? (
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
              -{discount}%
            </span>
          ) : null}
        </div>
      </Link>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          {product.category?.name || "Nails"}
        </p>
        <h3 className="mt-3 text-xl font-semibold text-foreground">{product.name}</h3>
        <p className="mt-2 text-sm leading-7 text-muted">{product.shortDescription}</p>
        {hasDiscount ? (
          <div className="mt-4 inline-flex rounded-full border border-red-300 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-600">
            New price
          </div>
        ) : null}
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Starting at</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{formatCurrency(currentPrice)}</p>
              {hasDiscount ? (
                <p className="mt-1 text-sm text-red-500 line-through decoration-2 decoration-red-500">
                  {formatCurrency(originalPrice)}
                </p>
              ) : null}
            </div>
            <div className="rounded-2xl border border-line/80 bg-background/75 px-3 py-2 text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">Best for</p>
              <p className="mt-1 text-sm font-medium text-foreground">{product.badge || "Everyday glow"}</p>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <Link
              to={`/products/${product.slug || product.id}`}
              className="action-button-primary"
            >
              Order Now
            </Link>
            <button
              type="button"
              onClick={() => addToCart(product)}
              aria-label={`Add ${product.name} to cart`}
              className="action-button-icon"
            >
              <FiShoppingBag />
            </button>
          </div>

          <Link
            to={`/products/${product.slug || product.id}`}
            className="action-button-secondary"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;
