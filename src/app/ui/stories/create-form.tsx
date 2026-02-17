"use client";

import { createStory, StoryState } from "@/app/lib/stories-actions";
import { useActionState, useState, useTransition } from "react";

export default function StoryForm() {
  const initialState: StoryState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createStory, initialState);
  const [isPending, startTransition] = useTransition();

  // Estado local para previsualizaciones
  const [previews, setPreviews] = useState<{
    image?: string;
    video?: string;
  }>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revocar URL anterior para evitar fugas de memoria
    if (type === 'image' && previews.image) URL.revokeObjectURL(previews.image);
    if (type === 'video' && previews.video) URL.revokeObjectURL(previews.video);

    setPreviews(prev => ({
      ...prev,
      [type]: URL.createObjectURL(file)
    }));
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(() => {
      formAction(formData);
    });
  }

  const handleYoutubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (!url) {
        setPreviews(prev => ({ ...prev, video: undefined }));
        return;
    }

    // Expresión regular para extraer el ID del video de YouTube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        const videoId = match[2];
        setPreviews(prev => ({
        ...prev,
        video: `https://www.youtube.com/embed/${videoId}`
        }));
    } else {
        // Si la URL no es válida, limpiamos la previsualización
        setPreviews(prev => ({ ...prev, video: undefined }));
    }
  };

  return (
    <form className="create-form" onSubmit={handleSubmit}>

      {/* Título de la Historia */}
      <div className="form-group">
        <label htmlFor="titulo">Título de la Historia</label>
        <input
            id="titulo" 
            type="text" 
            name="titulo" 
            placeholder="Ej: El proceso detrás del tallado" 
        />
        {state.errors?.titulo && (
          <div className="error-container">
            {state.errors.titulo.map((error) => (
              <p className="error-text" key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>

      {/* Resumen de la historia */}
      <div className="form-group">
        <label htmlFor="contenido">Resumen</label>
        <input
            id="contenido" 
            name="contenido"
            type="text"
            placeholder="Escribe aquí el resumen de tu historia..."
        />
        {state.errors?.contenido && (
          <div className="error-container">
            {state.errors.contenido.map((error) => (
              <p className="error-text" key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>

      {/* Contenido / Cuerpo de la historia */}
      <div className="form-group">
        <label htmlFor="contenido">Contenido</label>
        <textarea 
            id="post" 
            name="post" 
            rows={6} 
            placeholder="Escribe aquí la historia..."
        />
        {state.errors?.post && (
          <div className="error-container">
            {state.errors.post.map((error) => (
              <p className="error-text" key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>

      {/* Tags / Etiquetas */}
      <div className="form-group">
        <label htmlFor="tags">Tags (separados por comas)</label>
        <input
          id="tags"
          name="tags"
          type="text"
          placeholder="proceso, madera, artesanal"
        />
      </div>

      {/* SUBIDA DE IMAGEN */}
      <div className="form-group">
        <label htmlFor="imagen_url">Imagen de Portada</label>
        <div className="file-upload-wrapper">
          <label htmlFor="imagen_url" className="custom-file-upload">
            <span className="upload-icon">📸</span> Seleccionar imagen
          </label>
          <input
            id="imagen_url"
            name="imagen_url"
            type="file"
            accept="image/*"
            className="hidden-file-input"
            onChange={(e) => handleFileChange(e, 'image')}
          />
        </div>
        {previews.image && (
          <div className="preview-gallery mt-2">
            <img src={previews.image} alt="Preview" className="rounded-lg h-40 object-cover" />
          </div>
        )}
      </div>

      {/* SUBIDA DE VIDEO */}
      <div className="form-group">
  <label htmlFor="video_url">Video de la Historia (URL de YouTube)</label>
  <input
    id="video_url"
    name="video_url"
    type="url"
    placeholder="https://www.youtube.com/watch?v=..."
    className="form-control" // Usa tus clases de estilo de texto
    onChange={(e) => handleYoutubeChange(e)}
  />
  
  {state.errors?.video_url && (
    <div className="error-container">
      {state.errors.video_url.map((error) => (
        <p className="error-text" key={error}>{error}</p>
      ))}
    </div>
  )}

  {/* Previsualización con Iframe */}
  {previews.video && (
    <div className="preview-gallery mt-2" style={{ aspectRatio: '16/9', height: 'auto' }}>
      <iframe
        width="100%"
        height="100%"
        src={previews.video}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
            defaultChecked={true}
          />
          <span>Publicar inmediatamente</span>
        </label>
      </div>

      <button 
        className="create-button" 
        type="submit" 
        disabled={isPending}
      >
        {isPending ? "Publicando..." : "Crear Historia"}
      </button>

      {/* Mensaje de Estado Global */}
      {state.message && (
        <div className={`form-message ${state.errors && Object.keys(state.errors).length > 0 ? "message-error" : "message-success"}`}>
          {state.message}
        </div>
      )}
    </form>
  );
}