import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import PageIntro from "../components/PageIntro";
import { useAuth } from "../context/AuthContext";
import { createOrder, fetchMyOrders, fetchProductById } from "../lib/api";
import { formatCurrency, formatShortDate } from "../lib/formatters";

const filters = ["all", "pending", "confirmed", "shipped", "delivered"];

function AccountOrdersPage() {
  const { isAuthenticated, isAdmin, token } = useAuth();
  const [status, setStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [previewItems, setPreviewItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadOrders = async (nextStatus = status) => {
    const data = await fetchMyOrders(token, nextStatus === "all" ? undefined : nextStatus);
    setOrders(data);
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    loadOrders();
  }, [status, token]);

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/account/orders" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin/products" replace />;
  }

  const openReorderPreview = async (order) => {
    try {
      const currentProducts = await Promise.all(
        order.items.map((item) => fetchProductById(item.productId))
      );

      if (currentProducts.some((product) => !product)) {
        toast.error("One or more old products are no longer available for reorder.");
        return;
      }

      setPreviewItems(
        currentProducts.map((product, index) => ({
          ...product,
          quantity: order.items[index].quantity
        }))
      );
      setSelectedOrder(order);
    } catch (error) {
      toast.error("Unable to load the latest product prices for reorder.");
    }
  };

  const confirmReorder = async () => {
    try {
      setIsSubmitting(true);
      await createOrder(
        {
          phone: selectedOrder.phone,
          address: selectedOrder.address,
          city: selectedOrder.city,
          paymentMethod: selectedOrder.paymentMethod,
          notes: `Reorder of ${selectedOrder.orderNumber}`,
          items: previewItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity
          }))
        },
        token
      );

      toast.success("Reorder placed successfully.");
      setSelectedOrder(null);
      setPreviewItems([]);
      await loadOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to place reorder.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageIntro
        eyebrow="My Orders"
        title="Track your past, pending and delivered orders"
        copy="Filter your order history by status and reorder any previous purchase after reviewing current product prices."
      />

      <section className="section-shell py-16">
        <div className="mb-6 flex flex-wrap gap-3">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={`rounded-full px-5 py-3 text-sm font-semibold capitalize ${
                status === item ? "bg-primary text-white" : "border border-line text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="glass-card rounded-[1.75rem] p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.26em] text-primary">
                    {order.orderNumber}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground capitalize">
                    {order.status}
                  </h2>
                  <p className="mt-2 text-sm text-muted">{formatShortDate(order.createdAt)}</p>
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-lg font-semibold text-foreground">{formatCurrency(order.total)}</p>
                  <p className="mt-1 text-sm text-muted">{order.items?.length || 0} items</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openReorderPreview(order)}
                  className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
                >
                  Reorder
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => {
          setSelectedOrder(null);
          setPreviewItems([]);
        }}
        title={selectedOrder ? `Reorder ${selectedOrder.orderNumber}` : "Reorder"}
      >
        {selectedOrder ? (
          <div className="space-y-5">
            <p className="text-sm leading-7 text-muted">
              These are your old items, but the prices below are the current live prices that will be used for the new order.
            </p>

            <div className="space-y-4">
              {previewItems.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-[1.5rem] border border-line bg-background p-4">
                  <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="mt-1 text-sm text-muted">Quantity: {item.quantity}</p>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {formatCurrency(Number(item.price) * Number(item.quantity))}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={confirmReorder}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isSubmitting ? "Placing reorder..." : "Confirm Reorder"}
            </button>
          </div>
        ) : null}
      </Modal>
    </>
  );
}

export default AccountOrdersPage;
