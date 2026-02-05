'use client';

import { useEffect, useState } from 'react';
import Sidebar from "../navigation/sidebar";
import Card from "../navigation/card";
import "./products.css";
import "../index.css";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('products');
    if (stored) {
      setProducts(JSON.parse(stored));
    }
  }, []);

  return (
    <main className="products-layout">
      <Sidebar />

      <section className="products-content">
        <div className="products-toolbar">
          <div className="search">Search</div>

          <div className="filters">
            <button className="active">New</button>
            <button>Price ascending</button>
            <button>Price descending</button>
            <button>Rating</button>
          </div>
        </div>

        <div className="products-grid">
          {products.length === 0 ? (
            <p>No hay productos creados</p>
          ) : (
            products.map((product) => (
              <Card
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                description={product.description}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
