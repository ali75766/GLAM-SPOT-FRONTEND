import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import PageIntro from "../components/PageIntro";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { fetchProductById, fetchProducts } from "../lib/api";
import { formatCurrency, getProductPricing } from "../lib/formatters";

function ProductDetailsPage() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      const currentProduct = await fetchProductById(productId);

      if (!currentProduct) {
        setNotFound(true);
        return;
      }

      setNotFound(false);
      setProduct(currentProduct);
      setActiveImage(currentProduct?.gallery?.[0] || currentProduct?.imageUrl || "");

      if (currentProduct?.categoryId) {
        const related = await fetchProducts({
          category: currentProduct.categoryId,
          limit: 4
        });

        setRelatedProducts(
          related.items.filter((item) => String(item.id) !== String(currentProduct.id)).slice(0, 3)
        );
      }
    };

    loadProduct();
  }, [productId]);

  if (notFound) {
    return (
      <div className="section-shell py-24">
        <div className="glass-card rounded-[2rem] p-10 text-center">
          Product not found. Try another item from the catalog.
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section-shell py-24">
        <div className="glass-card rounded-[2rem] p-10 text-center">Loading product...</div>
      </div>
    );
  }

  const gallery = product.gallery?.length ? product.gallery : [product.imageUrl];
  const { currentPrice, originalPrice, hasDiscount } = getProductPricing(product);

  return (
    <>
      <PageIntro
        eyebrow={product.category?.name || "Product"}
        title={product.name}
        copy={product.shortDescription}
      />

      <section className="section-shell py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <div className="glass-card overflow-hidden rounded-[2rem] p-4">
              <img src={activeImage} alt={product.name} className="h-[34rem] w-full rounded-[1.5rem] object-cover" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {gallery.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`overflow-hidden rounded-[1.5rem] border p-2 transition ${
                    image === activeImage ? "border-primary" : "border-line"
                  }`}
                >
                  <img src={image} alt={product.name} className="h-28 w-full rounded-xl object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              {product.category?.name || "Nail essential"}
            </p>
            <h1 className="mt-4 font-display text-5xl text-foreground">{product.name}</h1>
            <p className="mt-6 text-base leading-8 text-muted">{product.description}</p>

            {hasDiscount ? (
              <div className="mt-8 inline-flex rounded-full border border-red-300 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-red-600">
                New price
              </div>
            ) : null}
            <div className="mt-8 flex items-end gap-4">
              <p className="text-3xl font-semibold text-foreground">{formatCurrency(currentPrice)}</p>
              {hasDiscount ? (
                <p className="text-lg text-red-500 line-through decoration-2 decoration-red-500">
                  {formatCurrency(originalPrice)}
                </p>
              ) : null}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => addToCart(product)}
                className="action-button-primary"
              >
                <FiShoppingBag />
                Add to cart
              </button>
              <Link
                to="/products"
                className="action-button-secondary"
              >
                Continue shopping
              </Link>
            </div>

            <div className="mt-10 grid gap-4 border-t border-line pt-8 sm:grid-cols-3">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-muted">Stock</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{product.stock} units</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-muted">Badge</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{product.badge || "Featured"}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-muted">Category</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{product.category?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="section-shell pb-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Related picks</p>
              <h2 className="mt-2 text-3xl font-semibold text-foreground">More from this category</h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

export default ProductDetailsPage;
