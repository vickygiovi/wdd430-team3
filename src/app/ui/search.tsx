'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchInput({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Esta función se dispara solo cuando el usuario deja de escribir
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    
    // Al buscar algo nuevo, siempre reseteamos a la página 1
    params.set('page', '1');

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    // Actualizamos la URL sin recargar la página completa
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input" // Añade tus clases de CSS aquí
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        // Importante: defaultValue mantiene el texto si el usuario refresca
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
}