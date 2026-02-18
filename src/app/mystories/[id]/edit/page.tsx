import "./edit.css"; // Tus estilos específicos de edición si existen
import React from "react";
import EditStoryForm from "@/app/ui/stories/edit-form";
import { fetchStoryById } from "@/app/lib/stories-data"; // Asegúrate de tener esta función
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  
  // 1. Extraemos el id de los params (Next.js 15+ requiere await)
  const { id } = await params;

  // 2. Buscamos la historia en la base de datos
  const fullStory = await fetchStoryById(id);

  // 3. Si la historia no existe, lanzamos un 404
  if (!fullStory) {
    notFound();
  }

  const storyData = {
    id: fullStory.id,
    titulo: fullStory.titulo,
    contenido: fullStory.contenido,
    post: fullStory.post,
    tags: fullStory.tags,
    imagen_url: fullStory.imagen_url,
    video_url: fullStory.video_url,
    publicado: fullStory.publicado,
  };

  return (
    <section className="create-container">
      <h1 className="create-title">Edit your Story</h1>
      
      {/* Pasamos la 'story' obtenida al componente cliente.
          Como la story ya viene con el formato de la DB, 
          el EditStoryForm la recibirá como prop. 
      */}
      <EditStoryForm story={storyData} />
      
    </section>
  );
}