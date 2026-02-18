'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type ReviewState = {
  errors?: {
    product_id?: string[];
    user_id?: string[];
    rating?: string[];
    comment?: string[];
  };
  message?: string | null;
  success?: boolean; // Opcional: para manejar estados de éxito visuales
};

const CreateReview = z.object({
  // UUID del producto al que pertenece la reseña
  product_id: z.string().uuid({
    message: "ID de producto inválido",
  }),

  // UUID del usuario que realiza la reseña
  user_id: z.string().uuid({
    message: "ID de usuario inválido",
  }),

  // rating es integer y NOT NULL
  rating: z.coerce
    .number()
    .int()
    .min(1, { message: "La calificación mínima es 1" })
    .max(5, { message: "La calificación máxima es 5" }),

  // comment es text y permite NULL (el switch Not NULL está apagado en la imagen)
  comment: z
    .string()
    .max(500, { message: "El comentario no puede exceder los 500 caracteres" })
    .optional()
    .or(z.literal("")),
});

export async function createReview(
  productId: string,    // Inyectado vía bind
  userId: string,       // Inyectado vía bind
  prevState: ReviewState, 
  formData: FormData
): Promise<ReviewState> {
  
  // 1. Validación con Zod
  const validatedFields = CreateReview.safeParse({
    product_id: productId,
    user_id: userId,
    rating: formData.get('rating'), // Zod coerce se encarga del string -> number
    comment: formData.get('comment'),
  });

  // 2. Manejo de errores de validación
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Por favor, completa los campos correctamente.',
    };
  }

  const { product_id, user_id, rating, comment } = validatedFields.data;

  try {
    // 3. Inserción en la base de datos
    // El 'id' se genera solo por el Default (gen_random_uuid) 
    // y 'created_at' suele ser automático en la DB
    await sql`
      INSERT INTO reviews (
        product_id, 
        user_id, 
        rating, 
        comment
      ) VALUES (
        ${product_id}, 
        ${user_id}, 
        ${rating}, 
        ${comment || null}
      )
    `;
  } catch (error) {
    console.error('Error al guardar la reseña:', error);
    return {
      message: 'Error de base de datos: No se pudo publicar tu comentario.',
    };
  }

  // 4. Revalidación de la página del producto para mostrar la nueva reseña
  revalidatePath(`/products/${product_id}`);
  
  return {
    message: '¡Reseña publicada con éxito!',
    errors: {},
  };
}