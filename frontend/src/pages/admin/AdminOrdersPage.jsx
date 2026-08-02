import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import AdminShellHeader from "../../components/admin/AdminShellHeader";
import Modal from "../../components/Modal";
import { useAuth } from "../../context/AuthContext";
import { fetchOrders } from "../../lib/api";
import { formatCurrency, formatShortDate } from "../../lib/formatters";

function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders(token).then(setOrders);
  }, [token]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <AdminShellHeader
        eyebrow="Orders"
        title="Read-Only Orders"
        description="This screen is intentionally not editable. The action icon opens a full preview modal with customer details, line items, totals, and notes."
      />

      <div className="min-h-0 flex-1 overflow-hidden rounded-[1.75rem] border border-line">
        <div className="h-full overflow-auto">
          <table className="min-w-full text-left">
            <thead className="bg-background text-xs uppercase tracking-[0.22em] text-muted">
              <tr>
                <th className="px-6 py-4">Order Number</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Preview</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-line/70">
                  <td className="px-6 py-5 font-semibold text-foreground">{order.orderNumber}</td>
                  <td className="px-6 py-5">
                    <p className="font-medium text-foreground">{order.customerName}</p>
                    <p className="mt-1 text-sm text-muted">{order.customerEmail}</p>
                  </td>
                  <td className="px-6 py-5 text-sm text-foreground">{order.status}</td>
                  <td className="px-6 py-5 text-sm text-foreground">{order.paymentMethod}</td>
                  <td className="px-6 py-5 text-sm font-semibold text-foreground">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-6 py-5 text-sm text-muted">{formatShortDate(order.createdAt)}</td>
                  <td className="px-6 py-5">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-background text-foreground transition hover:border-primary hover:text-primary"
                      aria-label={`Preview ${order.orderNumber}`}
                    >
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order ${selectedOrder.orderNumber}` : "Order Preview"}
      >
        {selectedOrder ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-line bg-background p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Customer Details</p>
                <p className="mt-3 font-semibold text-foreground">{selectedOrder.customerName}</p>
                <p className="mt-1 text-sm text-muted">{selectedOrder.customerEmail}</p>
                <p className="mt-1 text-sm text-muted">{selectedOrder.phone}</p>
              </div>
              <div className="rounded-[1.5rem] border border-line bg-background p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Delivery Details</p>
                <p className="mt-3 text-sm text-foreground">{selectedOrder.address}</p>
                <p className="mt-1 text-sm text-muted">{selectedOrder.city}</p>
                <p className="mt-1 text-sm text-muted">{selectedOrder.paymentMethod}</p>
              </div>
            </div>

            <div className="space-y-4">
              {selectedOrder.items?.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="flex gap-4 rounded-[1.5rem] border border-line bg-background p-4">
                  <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="mt-1 text-sm text-muted">Quantity: {item.quantity}</p>
                    <p className="mt-1 text-sm text-muted">Unit Price: {formatCurrency(item.unitPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

export default AdminOrdersPage;
