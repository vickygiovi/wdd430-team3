'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// CREATE: Nueva Historia
export async function createStory(artesanoId: string, formData: FormData) {
  const titulo = formData.get('titulo') as string;
  const contenido = formData.get('contenido') as string;
  const imagen_url = formData.get('imagen_url') as string;
  const video_url = formData.get('video_url') as string;
  const publicado = formData.get('publicado') === 'on';

  try {
    await sql`
      INSERT INTO stories (
        artesano_id, titulo, contenido, imagen_url, video_url, publicado, likes_count
      ) VALUES (
        ${artesanoId}, ${titulo}, ${contenido}, ${imagen_url}, ${video_url}, ${publicado}, 0
      )
    `;
  } catch (error) {
    console.error('Error al crear la historia:', error);
  }

  revalidatePath('/stories'); // Refresca el feed global
  redirect('/stories'); // Vuelve a la gestión del artesano
}

// UPDATE: Editar Historia
export async function updateStory(id: string, formData: FormData) {
  const titulo = formData.get('titulo') as string;
  const contenido = formData.get('contenido') as string;
  const imagen_url = formData.get('imagen_url') as string;
  const video_url = formData.get('video_url') as string;
  const publicado = formData.get('publicado') === 'on';

  try {
    await sql`
      UPDATE stories
      SET 
        titulo = ${titulo},
        contenido = ${contenido},
        imagen_url = ${imagen_url},
        video_url = ${video_url},
        publicado = ${publicado},
        updated_at = now()
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Error al actualizar la historia:', error);
  }

  revalidatePath('/stories');
  redirect('/stories');
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
export async function likeStory(id: string) {
  try {
    await sql`UPDATE stories SET likes_count = likes_count + 1 WHERE id = ${id}`;
    revalidatePath('/stories');
  } catch (error) {
    console.error(error);
  }
}