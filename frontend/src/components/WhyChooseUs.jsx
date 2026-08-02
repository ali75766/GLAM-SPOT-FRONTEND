import {
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineSquares2X2,
  HiOutlineShoppingBag
} from "react-icons/hi2";
import SectionHeading from "./SectionHeading";

const iconMap = {
  shield: HiOutlineShieldCheck,
  sparkles: HiOutlineSparkles,
  bag: HiOutlineShoppingBag,
  dashboard: HiOutlineSquares2X2
};

const whyChooseUs = [
  {
    title: "Healthy Nails First",
    copy: "We spotlight nail care, prep and polish products with clear, honest product storytelling.",
    icon: "shield"
  },
  {
    title: "Studio-Level Polish",
    copy: "The interface is crafted to feel premium, responsive and delightful across every screen size.",
    icon: "sparkles"
  },
  {
    title: "Fast Cart Journey",
    copy: "A generic cart lives across the whole storefront, so adding nail products always feels immediate.",
    icon: "bag"
  },
  {
    title: "Admin Ready",
    copy: "Categories and products are driven by clean CRUD endpoints ready for daily business operations.",
    icon: "dashboard"
  }
];

function WhyChooseUs() {
  return (
    <section className="section-shell py-20">
      <SectionHeading
        eyebrow="Why choose us"
        title="A Nail Studio Storefront Built To Feel Thoughtful, Modern And Easy To Run"
        copy="From the first scroll to the admin panel, Glam Nail Studio is structured for visual polish and practical daily use."
        align="center"
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {whyChooseUs.map((item) => {
          const Icon = iconMap[item.icon];

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
    </section>
  );
}

export default WhyChooseUs;
