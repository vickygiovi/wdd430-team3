'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../products.css';
import '../../index.css';

export default function CreateProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const stored = localStorage.getItem('products');
    const products = stored ? JSON.parse(stored) : [];

    const newProduct = {
      id: crypto.randomUUID(), // 🔑 ID ÚNICO
      name: form.name,
      price: Number(form.price),
      description: form.description,
    };

    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));

    router.push(`/products/${newProduct.id}`); // 🔁 ir directo al detalle
  };

  return (
    <section className="create-container">
      <h1 className="create-title">Create a Product</h1>

      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <button className="create-button">Create</button>
      </form>
    </section>
  );
}
