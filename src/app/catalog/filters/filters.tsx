'use client'

import { useState } from "react";
import "./filters.css";

// Definimos los filtros fuera del componente para que el código sea más limpio
const FILTERS = ["New", "Price ascending", "Price descending", "Rating"];

export default function Filters() {
  // Estado para rastrear cuál botón está activo (por defecto el primero)
  const [activeFilter, setActiveFilter] = useState("New");

  return (
      <div className="filters">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            // Si el nombre del filtro coincide con el estado, aplicamos la clase 'active'
            className={activeFilter === filter ? "active" : ""}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
  );
}