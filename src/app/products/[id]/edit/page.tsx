import "../../products.css";
import "../../../index.css";
import React from "react";
import Image from "next/image";
import "./edit.css";
import EditForm from "@/app/ui/products/edit-form";
import { fetchCategories } from '@/app/lib/category-data';
import { fetchProductById } from "@/app/lib/products-data";

export default async function Form({ params }: { params: { id: string } }) {

  // 2. Debes hacer await de params para extraer el id
  const { id } = await params;

  const categories = await fetchCategories();

  const product = await fetchProductById(id);
  
  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  // ) => {
  //   const { name, value } = e.target;
  //   setForm((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const stored = localStorage.getItem("products");
  //   const products = stored ? JSON.parse(stored) : [];

  //   products.push({
  //     name: form.name,
  //     price: Number(form.price),
  //     description: form.description,
  //   });

  //   localStorage.setItem("products", JSON.stringify(products));
  // };

  return (
    <section className="create-container">
      <h1 className="create-title">Edit a Product</h1>
      <EditForm product={product} categories={categories}/>
      
    </section>
  );
}
