import { useEffect, useState } from "react";
import PageIntro from "../components/PageIntro";
import CategoryCard from "../components/CategoryCard";
import { fetchCategories } from "../lib/api";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  return (
    <>
      <PageIntro
        eyebrow="Nail categories"
        title="Browse every nail collection by how clients naturally choose"
        copy="Each category leads into its own filtered product experience, making nail discovery feel simple and premium."
      />

      <section className="section-shell py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </>
  );
}

export default CategoriesPage;
