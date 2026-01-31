'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../products.css';
import '../../index.css';
import React from 'react';

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
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const stored = localStorage.getItem('products');
    const products = stored ? JSON.parse(stored) : [];

    products.push({
      name: form.name,
      price: Number(form.price),
      description: form.description,
    });

    localStorage.setItem('products', JSON.stringify(products));

    router.push('/products');
  };

return (
  <section className="create-container">
    <h1 className="create-title">Create a Product</h1>

    <form className="create-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <button className="create-button" type="submit">
        Create
      </button>
    </form>
  </section>
);
}
