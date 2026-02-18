import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export interface Review {
  id: string;               // uuid (Primary Key)
  product_id: string;       // uuid (Not NULL)
  user_id: string;          // uuid (Not NULL)
  rating: number;           // integer (Not NULL)
  comment?: string;         // text (Opcional según tu captura)
  created_at: Date | string; // timestamp with time zone
  updated_at: Date | string; // timestamp with time zone
}

export async function fetchProductReviewsByProductId(id: string) {
  try {
    const data = await sql`
      SELECT 
        p.id AS producto_id,
        p.nombre AS producto_nombre,
        p.precio,
        p.imagen_principal_url,
        r.id AS review_id,
        r.rating,
        r.comment,
        r.user_id,
        r.created_at AS fecha_review
    FROM products p
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE p.id = ${id}
    `;

    return data.map(row => ({
        id: row.id,                          // UUID de la review
        product_id: row.product_id,          // UUID del producto relacionado
        user_id: row.user_id,                // UUID del usuario que comenta
        
        // Rating: Postgres suele devolver 'integer' como number, 
        // pero lo forzamos por seguridad
        rating: parseInt(row.rating),        
        
        // Comment: Campo de texto (opcional en tu DB)
        comment: row.comment ?? undefined,   
        
        // Fechas: Las convertimos a objeto Date para facilitar su uso en el frontend
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
    }));
  } catch (error) {
    throw new Error('Producto no encontrado.');
  }
}