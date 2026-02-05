'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;

    const stored = localStorage.getItem('products');
    if (!stored) return;

    const products: Product[] = JSON.parse(stored);
    const found = products.find((p) => p.id === id);

    setProduct(found || null);
  }, [id]);

  if (!product) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Product not found</h1>
        <Link href="/products">← Back to products</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{product.name}</h1>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Description:</strong> {product.description}</p>

      <Link href="/products">← Back to products</Link>
    </div>
  );
}
