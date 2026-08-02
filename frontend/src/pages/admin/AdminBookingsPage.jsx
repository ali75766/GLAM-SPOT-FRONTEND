import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import AdminShellHeader from "../../components/admin/AdminShellHeader";
import Modal from "../../components/Modal";
import { useAuth } from "../../context/AuthContext";
import { fetchBookings } from "../../lib/api";
import { formatShortDate } from "../../lib/formatters";

function AdminBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings(token).then(setBookings);
  }, [token]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <AdminShellHeader
        eyebrow="Bookings"
        title="Read-Only Booking Requests"
        description="Every appointment request submitted from the booking page appears here with customer details, selected nail service and notes."
      />

      <div className="min-h-0 flex-1 overflow-hidden rounded-[1.75rem] border border-line">
        <div className="h-full overflow-auto">
          <table className="min-w-full text-left">
            <thead className="bg-background text-xs uppercase tracking-[0.22em] text-muted">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Preferred Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Preview</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-t border-line/70">
                  <td className="px-6 py-5">
                    <p className="font-medium text-foreground">{booking.customerName}</p>
                    <p className="mt-1 text-sm text-muted">{booking.customerEmail}</p>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-foreground">{booking.serviceName}</td>
                  <td className="px-6 py-5 text-sm text-foreground">{formatShortDate(booking.preferredDate)}</td>
                  <td className="px-6 py-5 text-sm text-foreground">{booking.status}</td>
                  <td className="px-6 py-5 text-sm text-muted">{formatShortDate(booking.createdAt)}</td>
                  <td className="px-6 py-5">
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(booking)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-background text-foreground transition hover:border-primary hover:text-primary"
                      aria-label={`Preview booking from ${booking.customerName}`}
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
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        title={selectedBooking ? `Booking for ${selectedBooking.customerName}` : "Booking Preview"}
      >
        {selectedBooking ? (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-line bg-background p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Customer Details</p>
                <p className="mt-3 font-semibold text-foreground">{selectedBooking.customerName}</p>
                <p className="mt-1 text-sm text-muted">{selectedBooking.customerEmail}</p>
                <p className="mt-1 text-sm text-muted">{selectedBooking.phone}</p>
              </div>
              <div className="rounded-[1.5rem] border border-line bg-background p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Appointment Details</p>
                <p className="mt-3 text-sm font-semibold text-foreground">{selectedBooking.serviceName}</p>
                <p className="mt-1 text-sm text-muted">{formatShortDate(selectedBooking.preferredDate)}</p>
                <p className="mt-1 text-sm text-muted">{selectedBooking.status}</p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-line bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Notes</p>
              <p className="mt-3 text-sm leading-7 text-muted">{selectedBooking.notes || "No notes provided."}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

export default AdminBookingsPage;
