'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function createReview(
  productId: string, 
  userId: string, 
  formData: FormData
) {
  const rating = parseInt(formData.get('rating') as string);
  const comment = formData.get('comment') as string;

  // Validación básica
  if (!rating || rating < 1 || rating > 5) {
    return { error: 'Por favor, selecciona una puntuación válida.' };
  }

  try {
    await sql`
      INSERT INTO reviews (
        product_id, 
        user_id, 
        rating, 
        comment
      ) VALUES (
        ${productId}, 
        ${userId}, 
        ${rating}, 
        ${comment}
      );
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { error: 'No se pudo guardar tu reseña. Inténtalo de nuevo.' };
  }

  // Revalidamos la página del producto para mostrar la nueva reseña
  revalidatePath(`/products/${productId}`);
  return { success: '¡Reseña publicada con éxito!' };
}