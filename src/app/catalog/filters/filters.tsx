'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import "./filters.css";

// Mapeamos el nombre visual al valor que espera tu función SQL
const FILTERS = [
  { label: "New", value: "date" },
  { label: "Price ascending", value: "price_asc" },
  { label: "Price descending", value: "price_desc" }
];

export default function Filters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // El "activeFilter" ahora viene directamente de la URL (o 'date' por defecto)
  const currentSort = searchParams.get('sortBy') || 'date';

  const handleFilterClick = (value: string) => {
    const params = new URLSearchParams(searchParams);
    
    // Seteamos el valor y reseteamos página para evitar resultados vacíos
    params.set('sortBy', value);
    params.set('page', '1');

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="filters">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          // Comparamos el valor de la URL para saber cuál resaltar
          className={currentSort === filter.value ? "active" : ""}
          onClick={() => handleFilterClick(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}