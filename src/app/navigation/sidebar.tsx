"use client";

import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import "./sidebar.css";
import { Category } from "../lib/category-data";

const Sidebar = ({ categories }: { categories: Category[]; }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // --- LECTURA DE LA URL ---
  // Si no hay keywords en la URL, usamos las 3 por defecto
  const urlKeywords = searchParams.get('keyword');
  const activeKeywords = urlKeywords 
    ? urlKeywords.split(',').filter(Boolean) 
    : []; // Esencia: Keywords por defecto

  const activeColor = searchParams.get('color') || "";
  const activeSize = searchParams.get('size') || "";
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 100;
  
  // Categorías: leemos si están en la URL (ej: ?categories=newArrivals,bestSellers)
  const activeCats = searchParams.get('categories')?.split(',') || [];

  const [inputValue, setInputValue] = useState("");

  // --- LÓGICA DE ACTUALIZACIÓN ---
  const updateURL = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    // Usamos Set para asegurar que los IDs sean únicos automáticamente
    const catsSet = new Set(activeCats);

    if (checked) {
      catsSet.add(name);
    } else {
      catsSet.delete(name);
    }

    const newCatsArray = Array.from(catsSet);
    
    updateURL({ 
      categories: newCatsArray.length > 0 ? newCatsArray.join(',') : undefined 
    });
  };

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const trimmed = inputValue.trim();
      if (!activeKeywords.includes(trimmed)) {
        const newKeywords = [...activeKeywords, trimmed];
        updateURL({ keyword: newKeywords.join(',') });
      }
      setInputValue("");
    }
  };

  const removeKeyword = (tag: string) => {
    const newKeywords = activeKeywords.filter((k) => k !== tag);
    updateURL({ keyword: newKeywords.length > 0 ? newKeywords.join(',') : undefined });
  };

  const debouncedPriceUpdate = useDebouncedCallback((min: number, max: number) => {
    updateURL({ minPrice: min.toString(), maxPrice: max.toString() });
  }, 400);

  return (
    <aside className="sidebar">
      {/* KEYWORDS */}
      <div className="filter-group">
        <h5 className="filter-title">KEYWORDS</h5>
        <input
          type="text"
          className="keyword-input"
          placeholder="Add tag and press Enter..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddKeyword}
        />
        <div className="tag-container">
          {activeKeywords.map((tag) => (
            <span key={tag} className="tag active">
              {tag} <span onClick={() => removeKeyword(tag)} style={{ cursor: "pointer" }}>×</span>
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIES (Recuperadas) */}
      {/* CATEGORIES */}
      <div className="filter-group">
        <h5 className="filter-title">CATEGORIES</h5>
        {categories.map((cat) => (
          <label key={cat.id} className="checkbox-item">
            <input
              type="checkbox"
              name={cat.id.toString()}
              checked={activeCats.includes(cat.id.toString())}
              onChange={handleCategoryChange}
            />
            <span>{cat.nombre}</span>
          </label>
        ))}
      </div>

      {/* PRICE RANGE */}
      <div className="filter-group">
        <h5 className="filter-title">PRICE RANGE</h5>
        <div className="range-slider-container">
          <input type="range" className="slider min-slider" min="0" max="100" value={minPrice} onChange={(e) => debouncedPriceUpdate(Number(e.target.value), maxPrice)} />
          <input type="range" className="slider max-slider" min="0" max="100" value={maxPrice} onChange={(e) => debouncedPriceUpdate(minPrice, Number(e.target.value))} />
        </div>
        <div className="price-text">
          <span>Min: <strong>${minPrice}</strong>, Max: <strong>${maxPrice}</strong></span>
        </div>
      </div>

      {/* SIZE */}
      <div className="filter-group">
        <h5 className="filter-title">SIZE</h5>
        <div className="size-grid">
          {["S", "M", "L"].map((s) => (
            <button
              key={s}
              className={`size-btn ${activeSize === s ? "active" : ""}`}
              onClick={() => updateURL({ size: activeSize === s ? undefined : s })}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* COLOR */}
      <div className="filter-group">
        <h5 className="filter-title">COLOR</h5>
        <div className="color-grid">
          {["white", "blue", "orange", "green", "black"].map((c) => (
            <button
              key={c}
              className={`color-btn ${c} ${activeColor === c ? "active" : ""}`}
              onClick={() => updateURL({ color: activeColor === c ? undefined : c })}
              title={c}
            ></button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;