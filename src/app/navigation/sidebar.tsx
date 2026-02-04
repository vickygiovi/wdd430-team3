"use client";

import { useState } from "react";
import "./sidebar.css";

const Sidebar: React.FC = () => {
  // 1. Estados para la reactividad
  const [activeKeywords, setActiveKeywords] = useState([
    "Spring",
    "Smart",
    "Modern",
  ]);

  const [categories, setCategories] = useState({
    newArrivals: true,
    bestSellers: false,
  });

  const [size, setSize] = useState("M");
  const [color, setColor] = useState("blue");

  // Estado inicial con rango
  const [price, setPrice] = useState({ min: 0, max: 100 });

  const [inputValue, setInputValue] = useState(""); // Nuevo estado para el input

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), price.max - 1);
    setPrice({ ...price, min: value });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), price.min + 1);
    setPrice({ ...price, max: value });
  };

  // Funciones controladoras
  const removeKeyword = (tag: string) => {
    setActiveKeywords(activeKeywords.filter((k) => k !== tag));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategories({ ...categories, [e.target.name]: e.target.checked });
  };

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      // Evitamos duplicados
      if (!activeKeywords.includes(inputValue.trim())) {
        setActiveKeywords([...activeKeywords, inputValue.trim()]);
      }
      setInputValue(""); // Limpiamos el input
    }
  };

  return (
    <aside className="sidebar">
      {/* Sección de Keywords */}
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
            <span
              key={tag}
              className={`tag ${tag === "Smart" ? "active" : ""}`}
            >
              {tag}{" "}
              <span
                onClick={() => removeKeyword(tag)}
                style={{ cursor: "pointer" }}
              >
                ×
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Sección de Categorías */}
      <div className="filter-group">
        <h5 className="filter-title">CATEGORIES</h5>
        <label className="checkbox-item">
          <input
            type="checkbox"
            name="newArrivals"
            checked={categories.newArrivals}
            onChange={handleCategoryChange}
          />
          <span>New Arrivals</span>
        </label>
        <label className="checkbox-item">
          <input
            type="checkbox"
            name="bestSellers"
            checked={categories.bestSellers}
            onChange={handleCategoryChange}
          />
          <span>Best Sellers</span>
        </label>
      </div>

      {/* Sección de Precio */}
      <div className="filter-group">
        <h5 className="filter-title">PRICE RANGE</h5>

        <div className="range-slider-container">
          <input
            type="range"
            className="slider min-slider"
            min="0"
            max="100"
            value={price.min}
            onChange={handleMinChange}
          />
          <input
            type="range"
            className="slider max-slider"
            min="0"
            max="100"
            value={price.max}
            onChange={handleMaxChange}
          />
        </div>

        <div className="price-text">
          <span>
            Min: <strong>${price.min.toFixed(2)}, </strong>
          </span>
          <span>
            Max: <strong>${price.max.toFixed(2)}</strong>
          </span>
        </div>
      </div>

      {/* Sección de Tallas */}
      <div className="filter-group">
        <h5 className="filter-title">SIZE</h5>
        <div className="size-grid">
          {["S", "M", "L"].map((s) => (
            <button
              key={s}
              className={`size-btn ${size === s ? "active" : ""}`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Sección de Colores */}
      <div className="filter-group">
        <h5 className="filter-title">COLOR</h5>
        <div className="color-grid">
          {["white", "blue", "orange", "green", "black"].map((c) => (
            <button
              key={c}
              className={`color-btn ${c} ${color === c ? "active" : ""}`}
              onClick={() => setColor(c)}
              title={c}
            ></button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
