import React, { useEffect, useRef } from "react";
import type { Category } from "../types";

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const activeEl = containerRef.current.querySelector(".category-tab.active");
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeCategory]);

  return (
    <nav className="category-nav-wrapper" id="sticky-category-nav">
      <div className="category-nav-container">
        <div ref={containerRef} className="category-nav-slider">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`category-tab ${activeCategory === category.id ? "active" : ""}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
