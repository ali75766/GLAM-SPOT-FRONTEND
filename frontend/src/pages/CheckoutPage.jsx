import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormError from "../components/forms/FormError";
import PageIntro from "../components/PageIntro";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createOrder } from "../lib/api";
import { formatCurrency } from "../lib/formatters";

function CheckoutPage() {
  const navigate = useNavigate();
  const { token, user, isAuthenticated } = useAuth();
  const { items, subtotal, clearCart, orderItems } = useCart();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      phone: "",
      address: "",
      city: "",
      paymentMethod: "Cash on Delivery",
      notes: ""
    }
  });

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + Number(item.quantity), 0),
    [items]
  );

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/checkout" replace />;
  }

  if (!items.length) {
    return (
      <>
        <PageIntro
          eyebrow="Checkout"
          title="Your cart is empty"
          copy="Add a few nail essentials before you move into the order placement step."
        />
        <section className="section-shell py-16">
          <div className="glass-card rounded-[2rem] p-8 text-center">
            <p className="text-sm leading-7 text-muted">There is nothing to checkout yet.</p>
          </div>
        </section>
      </>
    );
  }

  const placeOrder = handleSubmit(async (values) => {
    try {
      const order = await createOrder(
        {
          ...values,
          items: orderItems
        },
        token
      );

      clearCart();
      toast.success("Order completed successfully.");
      navigate("/checkout/success", {
        state: { order }
      });
    } catch (apiError) {
      toast.error(apiError.response?.data?.message || "Unable to place order.");
    }
  });

  return (
    <>
      <PageIntro
        eyebrow="Checkout"
        title="Review your nail bag and place your order"
        copy="This checkout flow is protected by customer login and sends the order directly to the backend."
      />

      <section className="section-shell py-16">
        <div className="grid gap-8 xl:grid-cols-[1fr_0.85fr]">
          <form onSubmit={placeOrder} className="glass-card rounded-[2rem] p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <input
                type="text"
                value={user?.name || ""}
                disabled
                className="w-full rounded-2xl border border-line bg-background px-5 py-4 text-muted outline-none"
              />
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full rounded-2xl border border-line bg-background px-5 py-4 text-muted outline-none"
              />
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <input
                  type="text"
                  placeholder="Phone number"
                  {...register("phone", { required: "Phone number is required" })}
                  className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                />
                <FormError message={errors.phone?.message} />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="City"
                  {...register("city", { required: "City is required" })}
                  className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                />
                <FormError message={errors.city?.message} />
              </div>
            </div>

            <div className="mt-5">
              <input
                type="text"
                placeholder="Delivery address"
                {...register("address", { required: "Delivery address is required" })}
                className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
              <FormError message={errors.address?.message} />
            </div>

            <select
              {...register("paymentMethod", { required: "Payment method is required" })}
              className="mt-5 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
            >
              <option>Cash on Delivery</option>
              <option>JazzCash</option>
              <option>EasyPaisa</option>
              <option>Bank Transfer</option>
            </select>

            <textarea
              rows="5"
              placeholder="Order notes"
              {...register("notes")}
              className="mt-5 w-full rounded-[1.5rem] border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isSubmitting ? "Placing order..." : "Place order"}
            </button>
          </form>

          <aside className="glass-card h-fit rounded-[2rem] p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Order summary</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">{itemCount} items</h2>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-[1.5rem] border border-line bg-background p-4">
                  <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted">Qty: {item.quantity}</p>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {formatCurrency(Number(item.price) * Number(item.quantity))}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-line bg-background p-5">
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span className="text-lg font-semibold text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              <p className="mt-3 text-xs leading-6 text-muted">
                Final pricing and any active product discounts are validated again on the backend before the order is saved.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default CheckoutPage;
