import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import PageIntro from "../components/PageIntro";

function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact us"
        title="Talk to Glam Nail Studio about your next nail look"
        copy="Send appointment questions, custom nail art ideas or product support requests and the studio team can follow up."
      />

      <section className="section-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            {[
              {
                title: "Visit the studio",
                copy: "Shop 14, Liberty Market, Gulberg III, Lahore",
                icon: FiMapPin
              },
              {
                title: "Call support",
                copy: "+92 42 3576 8900",
                icon: FiPhone
              },
              {
                title: "Send an email",
                copy: "support@glamnailstudio.pk",
                icon: FiMail
              }
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="glass-card rounded-[1.75rem] p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
                    <Icon />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{item.copy}</p>
                </div>
              );
            })}
          </div>

          <form className="glass-card rounded-[2rem] p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Your name"
                className="rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
              <input
                type="email"
                placeholder="Email address"
                className="rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="mt-5 w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
            />
            <textarea
              rows="7"
              placeholder="Tell us what you need..."
              className="mt-5 w-full rounded-[1.5rem] border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
            />
            <button
              type="button"
              className="mt-6 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white transition hover:shadow-glow"
            >
              Send message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
