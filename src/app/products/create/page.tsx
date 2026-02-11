import "../products.css";
import "../../index.css";
import React from "react";
import Image from "next/image";
import "./create.css";
import CreateForm from "@/app/ui/products/create-form";
import { fetchCategories } from '@/app/lib/category-data';

export default async function Form() {

  const categories = await fetchCategories();

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
      <h1 className="create-title">Create a Product</h1>
      <CreateForm categories={categories}/>
      
    </section>
  );
}
