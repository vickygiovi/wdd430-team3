"use client";

import { updateStory, StoryState } from "@/app/lib/stories-actions";
import { useActionState, useState, useTransition, useEffect } from "react";

// Definimos la interfaz de la historia que recibimos
interface Story {
  id: string;
  titulo?: string;
  contenido: string;
  post: string;
  tags: string[];
  imagen_url?: string;
  video_url?: string;
  publicado: boolean;
}

export default function EditStoryForm({ story }: { story: Story }) {
  const initialState: StoryState = { message: null, errors: {} };
  
  // Usamos bind para pasar el ID de la historia a la acción automáticamente
  const updateStoryWithId = updateStory.bind(null, story.id);
  const [state, formAction] = useActionState(updateStoryWithId, initialState);
  const [isPending, startTransition] = useTransition();

  // Estado local para previsualizaciones inicializadas con los datos existentes
  const [previews, setPreviews] = useState<{
    image?: string;
    video?: string;
  }>({
    image: story.imagen_url || undefined,
    video: story.video_url?.includes('youtube.com') || story.video_url?.includes('youtu.be') 
           ? transformYoutubeUrl(story.video_url) 
           : undefined
  });

  // Función auxiliar para transformar URL de YouTube a Embed (para el iframe)
  function transformYoutubeUrl(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}` 
      : undefined;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previews.image && !previews.image.startsWith('http')) {
        URL.revokeObjectURL(previews.image);
    }

    setPreviews(prev => ({
      ...prev,
      image: URL.createObjectURL(file)
    }));
  };

  const handleYoutubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (!url) {
        setPreviews(prev => ({ ...prev, video: undefined }));
        return;
    }
    const embedUrl = transformYoutubeUrl(url);
    setPreviews(prev => ({ ...prev, video: embedUrl }));
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      {/* Título */}
      <div className="form-group">
        <label htmlFor="titulo">Título de la Historia</label>
        <input
            id="titulo" 
            type="text" 
            name="titulo" 
            defaultValue={story.titulo}
        />
        {state.errors?.titulo && (
          <div className="error-container">
            {state.errors.titulo.map((error) => (
              <p className="error-text" key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="form-group">
        <label htmlFor="contenido">Resumen</label>
        <input
            id="contenido" 
            name="contenido"
            type="text"
            defaultValue={story.contenido}
        />
        {state.errors?.contenido && (
          <div className="error-container">
            {state.errors.contenido.map((error) => (
              <p className="error-text" key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>

      {/* Contenido Extenso */}
      <div className="form-group">
        <label htmlFor="post">Contenido</label>
        <textarea 
            id="post" 
            name="post" 
            rows={6} 
            defaultValue={story.post}
        />
        {state.errors?.post && (
          <div className="error-container">
            {state.errors.post.map((error) => (
              <p className="error-text" key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="form-group">
        <label htmlFor="tags">Tags (separados por comas)</label>
        <input
          id="tags"
          name="tags"
          type="text"
          defaultValue={story.tags?.join(', ')}
        />
      </div>

      {/* IMAGEN DE PORTADA */}
      <div className="form-group">
        <label htmlFor="imagen_url">Imagen de Portada (Dejar vacío para mantener actual)</label>
        <div className="file-upload-wrapper">
          <label htmlFor="imagen_url" className="custom-file-upload">
            <span className="upload-icon">📸</span> Cambiar imagen
          </label>
          <input
            id="imagen_url"
            name="imagen_url"
            type="file"
            accept="image/*"
            className="hidden-file-input"
            onChange={handleFileChange}
          />
        </div>
        {previews.image && (
          <div className="preview-gallery mt-2">
            <img src={previews.image} alt="Preview" className="rounded-lg h-40 object-cover" />
          </div>
        )}
      </div>

      {/* VIDEO YOUTUBE */}
      <div className="form-group">
        <label htmlFor="video_url">Video de la Historia (URL de YouTube)</label>
        <input
            id="video_url"
            name="video_url"
            type="url"
            defaultValue={story.video_url}
            onChange={handleYoutubeChange}
        />
        {previews.video && (
            <div className="preview-gallery mt-2" style={{ aspectRatio: '16/9', height: 'auto' }}>
            <iframe
                width="100%"
                height="100%"
                src={previews.video}
                title="YouTube video player"
                frameBorder="0"
                allowFullScreen
                className="rounded-lg"
            ></iframe>
            </div>
        )}
      </div>

      {/* Switch de Publicación */}
      <div className="form-group-checkbox">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="publicado"
            defaultChecked={story.publicado}
          />
          <span>Publicado</span>
        </label>
      </div>

      <button 
        className="create-button" 
        type="submit" 
        disabled={isPending}
      >
        {isPending ? "Guardando..." : "Actualizar Historia"}
      </button>

      {state.message && (
        <div className={`form-message ${state.errors && Object.keys(state.errors).length > 0 ? "message-error" : "message-success"}`}>
          {state.message}
        </div>
      )}
    </form>
  );
}