import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { HiMapPin } from "react-icons/hi2";
import { FiMail, FiPhone } from "react-icons/fi";
import { PiPaintBrushBroad } from "react-icons/pi";
import { fetchCategories } from "../lib/api";

function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data.slice(0, 6)))
      .catch(() => setCategories([]));
  }, []);

  return (
    <footer className="mt-16 overflow-hidden bg-[#161a2b] text-white">
      <div className="border-b border-white/10">
        <div className="section-shell py-14 text-center">
          <h2 className="font-display text-5xl">Stay in the loop</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            Get nail design drops, appointment openings and studio care notes delivered with zero fluff.
          </p>
          <form className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email address"
              className="h-14 flex-1 rounded-full border border-white/10 bg-white/10 px-6 text-white placeholder:text-white/45 outline-none"
            />
            <button type="button" className="rounded-full bg-primary px-8 py-4 font-semibold text-white">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="section-shell grid gap-12 py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl text-white">
              <PiPaintBrushBroad />
            </span>
            <p className="font-display text-4xl text-white">Glam Nail Studio</p>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-8 text-white/65">
            Your destination for premium nail services, nail care and polished studio products in Pakistan.
          </p>
          <div className="mt-6 space-y-3 text-sm text-white/70">
            <p className="flex items-start gap-3">
              <HiMapPin className="mt-1 text-primary" />
              Shop 14, Liberty Market, Gulberg III, Lahore
            </p>
            <p className="flex items-center gap-3">
              <FiPhone className="text-primary" />
              +92 42 3576 8900
            </p>
            <p className="flex items-center gap-3">
              <FiMail className="text-primary" />
              support@glamnailstudio.pk
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white">Quick Links</h3>
          <div className="mt-5 space-y-4 text-sm text-white/70">
            <Link to="/">Home</Link>
            <Link to="/products" className="block">
              Nail Services
            </Link>
            <Link to="/categories" className="block">
              Nail Categories
            </Link>
            <Link to="/about" className="block">
              About us
            </Link>
            <Link to="/contact" className="block">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white">Nail Categories</h3>
          <div className="mt-5 space-y-4 text-sm text-white/70">
            {categories.map((category) => (
              <Link key={category.id} to={`/products?category=${category.id}`} className="block">
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white">Payments</h3>
          <p className="mt-5 text-sm leading-8 text-white/70">
            Subscribe for appointment openings, nail arrivals and care tips.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["JazzCash", "EasyPaisa", "Bank Transfer", "Cash on Delivery"].map((item) => (
              <span key={item} className="rounded-full bg-white/10 px-3 py-2 text-xs font-medium text-white/75">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
