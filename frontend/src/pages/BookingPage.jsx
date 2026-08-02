import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FiCalendar } from "react-icons/fi";
import { PiPaintBrushBroad } from "react-icons/pi";
import FormError from "../components/forms/FormError";
import PageIntro from "../components/PageIntro";
import { createBooking, fetchCategories } from "../lib/api";

function BookingPage() {
  const [categories, setCategories] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      customerName: "",
      customerEmail: "",
      phone: "",
      preferredDate: "",
      serviceCategoryId: "",
      notes: ""
    }
  });

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {
        toast.error("Unable to load nail services.");
      });
  }, []);

  const submitBooking = handleSubmit(async (values) => {
    try {
      await createBooking(values);
      toast.success("Booking request received.");
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to request booking.");
    }
  });

  return (
    <>
      <PageIntro
        eyebrow="Booking"
        title="Reserve your next Glam Nail Studio appointment"
        copy="Pick a service, share your preferred time and our studio team will confirm your manicure, extension or nail-art slot."
      />

      <section className="section-shell grid gap-8 py-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          {categories.slice(0, 3).map((category) => (
            <div key={category.id} className="glass-card rounded-[1.5rem] p-5">
              <PiPaintBrushBroad className="text-2xl text-primary" />
              <p className="mt-4 text-sm uppercase tracking-[0.22em] text-muted">Nail service</p>
              <p className="mt-2 text-xl font-semibold text-foreground">{category.name}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{category.description}</p>
            </div>
          ))}
        </div>

        <form onSubmit={submitBooking} className="glass-card rounded-[1.75rem] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <input
                className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none focus:border-primary"
                placeholder="Full name"
                {...register("customerName", { required: "Full name is required" })}
              />
              <FormError message={errors.customerName?.message} />
            </div>
            <div>
              <input
                className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none focus:border-primary"
                placeholder="Phone number"
                {...register("phone", { required: "Phone number is required" })}
              />
              <FormError message={errors.phone?.message} />
            </div>
            <div>
              <input
                type="email"
                className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none focus:border-primary"
                placeholder="Email address"
                {...register("customerEmail", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address"
                  }
                })}
              />
              <FormError message={errors.customerEmail?.message} />
            </div>
            <div>
              <input
                type="date"
                className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none focus:border-primary"
                {...register("preferredDate", { required: "Preferred date is required" })}
              />
              <FormError message={errors.preferredDate?.message} />
            </div>
            <div className="md:col-span-2">
              <select
                className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none focus:border-primary"
                {...register("serviceCategoryId", { required: "Please select a nail service" })}
              >
                <option value="">Select nail service</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <FormError message={errors.serviceCategoryId?.message} />
            </div>
          </div>
          <textarea
            className="mt-4 min-h-36 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none focus:border-primary"
            placeholder="Tell us about your nail look"
            {...register("notes")}
          />
          <button type="submit" disabled={isSubmitting} className="action-button-primary mt-4 disabled:opacity-60">
            <FiCalendar />
            {isSubmitting ? "Sending..." : "Request Booking"}
          </button>
        </form>
      </section>
    </>
  );
}

export default BookingPage;
