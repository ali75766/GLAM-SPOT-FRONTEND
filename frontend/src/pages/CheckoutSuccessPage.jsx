import { Link, useLocation, Navigate } from "react-router-dom";
import PageIntro from "../components/PageIntro";
import { formatCurrency } from "../lib/formatters";

function CheckoutSuccessPage() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <PageIntro
        eyebrow="Order placed"
        title={`Thanks, your order ${order.orderNumber} has been created`}
        copy="Your checkout is now connected to the backend, so the admin orders listing and your customer order history can read this order immediately."
      />

      <section className="section-shell py-16">
        <div className="mx-auto max-w-3xl glass-card rounded-[2rem] p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-line bg-background p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-primary">Order number</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{order.orderNumber}</p>
            </div>
            <div className="rounded-[1.5rem] border border-line bg-background p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-primary">Total</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{formatCurrency(order.total)}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/products"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
            >
              Continue shopping
            </Link>
            <Link
              to="/"
              className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-foreground"
            >
              Back home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default CheckoutSuccessPage;
