"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../products.css";
import "../../../index.css";
import React from "react";
import Image from "next/image";
import "../../create/create.css";

export default function CreateProductPage() {
  const router = useRouter();

  interface ProductForm {
    name: string;
    price: string;
    description: string;
    images: string[]; // Aquí definimos que es un array de strings
  }

  const [form, setForm] = useState<ProductForm>({
    name: "Hand-Thrown Ceramic Mug",
    price: "32.0",
    description: "A rustic, speckled stoneware mug with a deep blue glaze, perfect for cozy mornings.",
    images: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const stored = localStorage.getItem("products");
    const products = stored ? JSON.parse(stored) : [];

    products.push({
      name: form.name,
      price: Number(form.price),
      description: form.description,
    });

    localStorage.setItem("products", JSON.stringify(products));

    router.push("/products");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Verificamos que existan archivos para evitar errores de nulos
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        // Forzamos el tipo a string porque readAsDataURL siempre devuelve un string (o null)
        const base64String = reader.result as string;

        setForm((prev) => ({
          ...prev,
          images: [...prev.images, base64String],
        }));

        console.log(form.images)
      };

      reader.readAsDataURL(file);
    });
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

        <div className="form-group">
          <label>Product Images</label>

          <div className="file-upload-wrapper">
            <label htmlFor="images" className="custom-file-upload">
              <span className="upload-icon">📁</span> Select images
            </label>
            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden-file-input"
            />
          </div>

          {/* Vista previa mejorada */}
          <div className="preview-gallery">
            {form.images.map((img, index) => (
              <div key={index} className="preview-item">
                <img src={img} alt="preview" />
              </div>
            ))}
          </div>
        </div>

        <button className="create-button" type="submit">
          Create
        </button>
      </form>
    </section>
  );
}
