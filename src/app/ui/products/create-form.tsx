"use client";

import { Category } from "@/app/lib/category-data";
import { createProduct, State } from "@/app/lib/products-actions";
import { useActionState, useState, useTransition } from "react"; // 1. Importar useTransition

export default function Form({ categories }: { categories: Category[] }) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createProduct, initialState);
  const [isPending, startTransition] = useTransition();

  interface ProductForm {
    images: File[];
    main_image?: File;
    previews: string[];
  }

  const [form, setForm] = useState<ProductForm>({
    images: [],
    previews: []
  });

  const [images, setImages] = useState<File[]>([]);

  const removeImage = (index: number) => {
    // 1. Revocamos la URL para evitar fugas de memoria
    URL.revokeObjectURL(form.previews[index]);

    // 2. Filtramos el array de archivos reales
    setImages((prev) => prev.filter((_, i) => i !== index));

    // 3. Filtramos las previews en el estado del form
    setForm((prev) => ({
      ...prev,
      previews: prev.previews.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    // Generamos las previews
    const newPreviews = files.map(file => URL.createObjectURL(file));

    // Guardamos los archivos reales
    setImages(prev => [...prev, ...files]);

    // Actualizamos el form solo con las previews
    setForm(prev => ({
      ...prev,
      previews: [...prev.previews, ...newPreviews],
    }));
  };


  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];

    setForm(prev => ({
      ...prev,
      main_image: file,
    }));
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    
    // Creamos el FormData a partir del formulario actual
    const formData = new FormData(event.currentTarget);

    // Si tienes archivos en el estado local que NO están en inputs nativos, 
    // debes agregarlos manualmente aquí:
    // Por ejemplo, si 'images' (galería) no se está vinculando bien:
    formData.delete("imagenes_galeria"); // Limpiamos si existe
    images.forEach((file) => {
      formData.append("imagenes_galeria", file);
    });

    // Ejecutamos la acción dentro de una transición
    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input id="name" type="text" name="nombre" />

        {state.errors?.name && (
          <div id="name-error" aria-live="polite" className="error-container">
            {state.errors.name.map((error: string) => (
              <p className="error-text" key={error}>
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input id="price" type="number" name="precio" />

        {state.errors?.price && (
          <div
            id="price-error"
            aria-live="polite"
            aria-atomic="true"
            className="error-container"
          >
            {state.errors.price.map((error: string) => (
              <p className="error-text mt-1 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="stock">Stock Quantity</label>
        <input
          id="stock"
          type="number"
          name="stock"
          placeholder="0"
          step="1"
          min="0"
        />

        {state.errors?.stock && (
          <div id="stock-error" aria-live="polite" className="error-container">
            {state.errors.stock.map((error: string) => (
              <p className="error-text mt-1 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="form-group-checkbox">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="is_available"
            defaultChecked={true} // O false, según prefieras por defecto
          />
          <span>Product Available for Sale</span>
        </label>

        {state.errors?.is_available && (
          <div
            id="available-error"
            aria-live="polite"
            className="error-container"
          >
            {state.errors.is_available.map((error: string) => (
              <p className="error-text mt-1 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="descripcion" />

        {state.errors?.description && (
          <div
            id="description-error"
            aria-live="polite"
            aria-atomic="true"
            className="error-container"
          >
            {state.errors.description.map((error: string) => (
              <p className="error-text mt-1 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category_id" // Este nombre debe coincidir con lo que busques en el Action
          className="form-control form-select" // O la clase que uses para tus inputs
          defaultValue=""
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        {/* Manejo de errores para la categoría */}
        {state.errors?.category_id && (
          <div
            id="category-error"
            aria-live="polite"
            className="error-container"
          >
            {state.errors.category_id.map((error: string) => (
              <p className="error-text mt-1 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo Size */}
        <div className="form-group">
          <label htmlFor="size">Size / Dimensions</label>
          <input
            id="size"
            name="size"
            type="text"
            placeholder="Ej: 20x30cm o Large"
          />
        </div>

        {/* Campo Color */}
        <div className="form-group">
          <label htmlFor="color">Color</label>
          <input
            id="color"
            name="color"
            type="text"
            placeholder="Ej: Madera natural, Azul, etc."
          />
        </div>
      </div>

      {/* Campo Keywords */}
      <div className="form-group">
        <label htmlFor="keywords">Keywords (separated by commas)</label>
        <input
          id="keywords"
          name="keywords"
          type="text"
          placeholder="decoracion, artesania, madera, hogar"
        />
        <p className="text-xs text-gray-500 mt-1">
          Press comma to separate tags.
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="imagen_principal">Main Product Image</label>
        <div className="file-upload-wrapper">
          <label htmlFor="imagen_principal" className="custom-file-upload">
            <span className="upload-icon">📸</span> Select main image
          </label>
          <input
            id="imagen_principal"
            name="imagen_principal"
            type="file"
            accept="image/*"
            className="hidden-file-input"
            onChange={handleMainImageChange}
          />
        </div>

        {state.errors?.mainImageFile && (
          <div
            id="main-image-error"
            aria-live="polite"
            className="error-container"
          >
            {state.errors.mainImageFile.map((error: string) => (
              <p className="error-text mt-1 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        )}

        {/* Vista previa mejorada */}
        {form.main_image && (
          <div className="preview-gallery">
            <img src={URL.createObjectURL(form.main_image)} alt="preview" />
          </div>
        )}
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
            name="imagenes_galeria"
          />
        </div>

        {/* Vista previa mejorada */}
        {form.previews.length > 0 && (
          <div className="preview-gallery grid grid-cols-3 gap-2 mt-4">
            {form.previews.map((url, index) => (
              <div key={url} className="preview-item relative group">
                <img
                  src={url}
                  alt={`preview-${index}`}
                  className="rounded-lg object-cover w-full h-32"
                />
                <button
                  type="button" // IMPORTANTE: evitar que haga submit
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
                  title="Remove image"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}


        {state.errors?.galleryFiles && (
          <div id="images-error" aria-live="polite" aria-atomic="true">
            {state.errors.galleryFiles.map((error: string) => (
              <p className="mt-1 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <button className="create-button" type="submit">
        Create
      </button>

      {/* Mensaje general al final del formulario */}
      {state.message && (
        <div id="form-error" aria-live="polite" aria-atomic="true">
          <div
            className={`form-message ${state.errors && Object.keys(state.errors).length > 0 ? "message-error" : "message-success"}`}
          >
            {state.message}
          </div>
        </div>
      )}
    </form>
  );
}
