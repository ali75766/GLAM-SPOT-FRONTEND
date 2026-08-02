import PageIntro from "../components/PageIntro";
import SectionHeading from "../components/SectionHeading";

const values = [
  {
    title: "Healthy Prep",
    copy: "Every nail service starts with care, clean shaping and product choices that feel trusted, not noisy."
  },
  {
    title: "Studio Quality",
    copy: "We design the experience to feel premium from first click to appointment planning."
  },
  {
    title: "Community",
    copy: "The brand voice is warm, modern and built for clients who want confidence without clutter."
  },
  {
    title: "Convenience",
    copy: "Fast discovery, responsive layout, simple cart flow and clean studio management."
  }
];

function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About us"
        title="A nail studio presence that feels polished enough to trust"
        copy="This page carries forward the spirit of your reference screens, but with clearer spacing, better typography and more intentional nail-studio storytelling."
      />

      <section className="section-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card rounded-[2rem] p-8">
            <SectionHeading
              eyebrow="Our story"
              title="Glam Nail Studio is designed to feel editorial, warm and appointment-ready"
              copy="The storefront balances soft nail-studio visuals with stronger contrast, richer motion and cleaner content rhythm so it can grow into a real ecommerce experience."
            />
          </div>
          <div className="glass-card overflow-hidden rounded-[2rem] p-4">
            <img
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=85"
              alt="Nail studio editorial"
              className="h-full min-h-[24rem] w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {values.map((value) => (
            <div key={value.title} className="glass-card rounded-[1.75rem] p-6">
              <h3 className="text-2xl font-semibold text-foreground">{value.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{value.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default AboutPage;
