import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function CategoryCard({ category }) {
  return (
    <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
      <Link
        to={`/products?category=${category.id}`}
        className="glass-card group block overflow-hidden rounded-[1.75rem] p-4"
      >
        <div className="overflow-hidden rounded-[1.4rem]">
          <img
            src={category.imageUrl}
            alt={category.name}
            className="h-44 w-full object-cover transition duration-500 group-hover:scale-110"
          />
        </div>
        <div className="px-2 pb-2 pt-5">
          <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
          <p className="mt-2 text-sm leading-7 text-muted">{category.description}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Explore category
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default CategoryCard;
