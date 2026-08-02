import PageIntro from "../components/PageIntro";

const galleryImages = [
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=85"
];

function GalleryPage() {
  return (
    <>
      <PageIntro
        eyebrow="Gallery"
        title="Nail looks for every mood, outfit and appointment"
        copy="Browse soft neutrals, chrome finishes, bridal sets and custom nail art inspiration before choosing your next studio visit."
      />

      <section className="section-shell py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {galleryImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`Glam Nail Studio gallery look ${index + 1}`}
              className="h-80 w-full rounded-[1.5rem] border border-line object-cover shadow-card"
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default GalleryPage;
