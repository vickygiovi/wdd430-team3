import React from "react";
import "./delete.css";
import DeleteStoryForm from "@/app/ui/stories/delete-form"; // El formulario que creamos antes
import { fetchStoryById } from "@/app/lib/stories-data"; // Asumiendo que tienes esta función

export default async function Page({ params }: { params: { id: string } }) {

  // 1. Extraer el ID de la historia desde los params (Next.js 15+ requiere await)
  const { id } = await params;

  // 2. Obtener los datos de la historia específica
  const story = await fetchStoryById(id);

  // 3. Manejo de error si la historia no existe
  if (!story) {
    return (
      <section className="create-container">
        <h1 className="create-title">Historia no encontrada</h1>
        <p className="text-center">El ID proporcionado no coincide con ninguna historia existente.</p>
      </section>
    );
  }

  return (
    <section className="create-container">
      <h1 className="create-title">Eliminar Historia</h1>
      
      {/* Pasamos la historia al formulario de borrado */}
      <DeleteStoryForm story={story} />
      
      {/* Opcional: Mostrar un resumen de lo que se va a borrar */}
      <br />
      <div className="text-center mt-4" style={{ opacity: 0.7 }}>
        <p>Esta acción eliminará permanentemente la historia y sus imágenes asociadas.</p>
      </div>
    </section>
  );
}