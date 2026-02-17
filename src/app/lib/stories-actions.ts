'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Sql } from "postgres";
import { z } from 'zod';

import { promises as fs } from 'fs';
import path from 'path';

async function saveFile(file: File, folder: string): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Crear un nombre único para evitar duplicados
  const safeName = file.name.replaceAll(" ", "_");
  const fileName = `${crypto.randomUUID()}-${safeName}`;
  const relativePath = `/uploads/${folder}/${fileName}`;
  const absolutePath = path.join(process.cwd(), 'public', relativePath);

  // Asegurarse de que el directorio existe
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  
  // Guardar el archivo
  await fs.writeFile(absolutePath, buffer);
  
  return relativePath; // Esto es lo que guardaremos en la DB
}

const parseKeywords = (raw: string | null): string[] => {
  if (!raw) return [];
  return raw.split(',').map(k => k.trim()).filter(k => k !== "");
};

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// CREATE: Nueva Historia
// export async function createStory(artesanoId: string, formData: FormData) {
//   const titulo = formData.get('titulo') as string;
//   const contenido = formData.get('contenido') as string;
//   const imagen_url = formData.get('imagen_url') as string;
//   const video_url = formData.get('video_url') as string;
//   const publicado = formData.get('publicado') === 'on';

//   try {
//     await sql`
//       INSERT INTO stories (
//         artesano_id, titulo, contenido, imagen_url, video_url, publicado, likes_count
//       ) VALUES (
//         ${artesanoId}, ${titulo}, ${contenido}, ${imagen_url}, ${video_url}, ${publicado}, 0
//       )
//     `;
//   } catch (error) {
//     console.error('Error al crear la historia:', error);
//   }

//   revalidatePath('/stories'); // Refresca el feed global
//   redirect('/stories'); // Vuelve a la gestión del artesano
// }

export type StoryState = {
  errors?: {
    artesano_id?: string[];
    titulo?: string[];
    contenido?: string[];
    imagen_url?: string[];
    video_url?: string[];
    publicado?: string[];
    tags?: string[];
    post?: string[];
  };
  message?: string | null;
};

const CreateStory = z.object({
  artesano_id: z.string().uuid(),
  titulo: z.string().max(150).optional().or(z.literal("")),
  contenido: z.string().min(1, "El resumen es obligatorio"),
  publicado: z.boolean(),
  tags: z.array(z.string()).default([]),
  // Campos de archivo
  imageFile: z.instanceof(File).nullable(),
  video_url: z.string().url().optional(),
  post: z.string().min(1, "El contenido es obligatorio"),
});

const UpdateStory = z.object({
  // Mantenemos las restricciones de longitud pero permitimos que sean opcionales
  titulo: z.string().max(150).optional().or(z.literal("")),
  
  contenido: z.string().min(1, "El resumen es obligatorio").optional(),
  
  publicado: z.boolean().optional(),
  
  tags: z.array(z.string()).optional(),
  
  // En archivos, permitimos null si se desea eliminar la imagen actual
  imageFile: z.instanceof(File).nullable().optional(),
  
  // URL de YouTube
  video_url: z.string().url().optional().or(z.literal("")),
  
  post: z.string().min(1, "El contenido es obligatorio").optional(),
});

export async function createStory(prevState: StoryState, formData: FormData): Promise<StoryState> {
  
  // 1. Pre-procesamiento de archivos (Imagen y Video opcionales)
  const rawImage = formData.get('imagen_url');
  const imageFile = (rawImage instanceof File && rawImage.size > 0) ? rawImage : null;

  const youtubeUrl = formData.get('video_url')?.toString() || null;

  const artesano_id_default = 'a239e0e7-70d2-47f9-83f7-d0a7e33e5850';

  // 2. Validación con Zod
  const validatedFields = CreateStory.safeParse({
    artesano_id: artesano_id_default, // ID fijo según tu ejemplo
    titulo: formData.get('titulo'),
    contenido: formData.get('contenido'),
    publicado: formData.get('publicado') === 'on',
    tags: parseKeywords(formData.get('tags')?.toString() || ""), // Reutilizamos tu lógica de tags
    imageFile: imageFile,
    video_url: youtubeUrl,
    post: formData.get('post')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos obligatorios en la historia.',
    };
  }

  const { artesano_id, titulo, contenido, publicado, tags, post, video_url } = validatedFields.data;

  try {
    // 3. Guardado de archivos (Si existen)
    let imagen_url = null;

    if (validatedFields.data.imageFile) {
      imagen_url = await saveFile(validatedFields.data.imageFile, 'stories/images');
    }

    // 4. Inserción en DB (Excluyendo created_at y updated_at como pediste)
    await sql`
      INSERT INTO stories (
        artesano_id, 
        titulo, 
        contenido, 
        imagen_url, 
        video_url, 
        publicado, 
        tags,
        likes_count,
        post
      ) VALUES (
        ${artesano_id}, 
        ${titulo || null}, 
        ${contenido}, 
        ${imagen_url}, 
        ${video_url ?? null},
        ${publicado}, 
        ${tags},
        0,
        ${post}
      )
    `;
  } catch (error) {
    console.error('Error al crear la historia:', error);
    return {
      message: 'Error de base de datos: No se pudo crear la historia.',
    };
  }

  revalidatePath('/mystories');
  redirect('/mystories');
}

// UPDATE: Editar Historia
// export async function updateStory(id: string, formData: FormData) {
//   const titulo = formData.get('titulo') as string;
//   const contenido = formData.get('contenido') as string;
//   const imagen_url = formData.get('imagen_url') as string;
//   const video_url = formData.get('video_url') as string;
//   const publicado = formData.get('publicado') === 'on';

//   try {
//     await sql`
//       UPDATE stories
//       SET 
//         titulo = ${titulo},
//         contenido = ${contenido},
//         imagen_url = ${imagen_url},
//         video_url = ${video_url},
//         publicado = ${publicado},
//         updated_at = now()
//       WHERE id = ${id}
//     `;
//   } catch (error) {
//     console.error('Error al actualizar la historia:', error);
//   }

//   revalidatePath('/stories');
//   redirect('/stories');
// }

export async function updateStory(
  id: string, // Inyectado vía .bind()
  prevState: StoryState,
  formData: FormData
): Promise<StoryState> {
  
  // 1. Pre-procesamiento de la nueva imagen (si se subió una)
  const rawImage = formData.get('imagen_url');
  const imageFile = (rawImage instanceof File && rawImage.size > 0) ? rawImage : null;
  
  const youtubeUrl = formData.get('video_url')?.toString() || null;

  // 2. Validación con Zod (usando el esquema parcial que definimos)
  const validatedFields = UpdateStory.safeParse({
    titulo: formData.get('titulo'),
    contenido: formData.get('contenido'),
    publicado: formData.get('publicado') === 'on',
    tags: parseKeywords(formData.get('tags')?.toString() || ""),
    imageFile: imageFile,
    video_url: youtubeUrl,
    post: formData.get('post')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación: Revisa los campos marcados.',
    };
  }

  const { titulo, contenido, publicado, tags, post, video_url } = validatedFields.data;

  try {
    // 3. Lógica de imagen inteligente
    let new_imagen_url = null;
    
    if (imageFile) {
      // Si hay un nuevo archivo, lo guardamos
      new_imagen_url = await saveFile(imageFile, 'stories/images');
    }

    // 4. Actualización en DB
    // Usamos COALESCE o lógica condicional para la imagen: 
    // Si new_imagen_url es null, significa que no se subió nada nuevo, 
    // por lo tanto no actualizamos esa columna o mantenemos la vieja.
    
    if (new_imagen_url) {
      await sql`
        UPDATE stories 
        SET 
          titulo = COALESCE(${titulo ?? null}, titulo), 
          contenido = COALESCE(${contenido ?? null}, contenido), 
          imagen_url = ${new_imagen_url}, 
          video_url = COALESCE(${video_url ?? null}, video_url), 
          publicado = ${publicado ?? false}, 
          tags = COALESCE(${tags ?? null}, tags), 
          post = COALESCE(${post ?? null}, post)
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE stories 
        SET 
          titulo = COALESCE(${titulo ?? null}, titulo), 
          contenido = COALESCE(${contenido ?? null}, contenido), 
          video_url = COALESCE(${video_url ?? null}, video_url), 
          publicado = ${publicado ?? false}, 
          tags = COALESCE(${tags ?? null}, tags), 
          post = COALESCE(${post ?? null}, post)
        WHERE id = ${id}
      `;
    }

  } catch (error) {
    console.error('Error al actualizar la historia:', error);
    return {
      message: 'Error de base de datos: No se pudo actualizar la historia.',
    };
  }

  // 5. Limpieza de caché y redirección
  revalidatePath('/mystories');
  revalidatePath(`/stories/${id}`); // También revalidamos la vista detalle de la historia
  redirect('/mystories');
}

// DELETE: Eliminar Historia
export async function deleteStory(id: string) {
  try {
    await sql`DELETE FROM stories WHERE id = ${id}`;
    revalidatePath('/stories');
    redirect('/stories');
  } catch (error) {
    console.error('Error al eliminar la historia:', error);
  }
}

// EXTRA: Like a una historia
export async function likeStory(id: string, prevState: StateLikes) {
  try {
    await sql`UPDATE stories SET likes_count = likes_count + 1 WHERE id = ${id}`;
    revalidatePath('/articles/' + id);

    return { ...prevState, success: true };
  } catch (error) {
    console.error(error);
    
    return prevState;
  }
}

export type StateLikes = {
  message?: string | null;
  error?: boolean;
};