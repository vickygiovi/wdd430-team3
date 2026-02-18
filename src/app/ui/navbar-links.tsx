'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function NavbarLinks() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón Hamburguesa - Solo visible en móviles */}
      <button 
        className="menu-mobile-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Lista de enlaces - Clase dinámica para abrir/cerrar */}
      <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
        <li>
          <Link href="/catalog" onClick={() => setIsOpen(false)}>Browse Catalog</Link>
        </li>
        <li>
          <Link href="/articles" onClick={() => setIsOpen(false)}>Stories</Link>
        </li>
        <li>
          <a href="#" onClick={() => setIsOpen(false)}>My Reviews</a>
        </li>
        <li>
          <a href="#" onClick={() => setIsOpen(false)}>Contact</a>
        </li>
      </ul>
    </>
  );
}