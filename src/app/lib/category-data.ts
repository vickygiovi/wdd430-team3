import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Define la interfaz para que coincida con tu SELECT
export interface Category {
  id: string;
  nombre: string;
  descripcion?: string;
  slug?: string;
}

// READ: Obtener todas las categorías para listados o selectores
export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await sql`
      SELECT id, nombre, descripcion, slug 
      FROM categories 
      ORDER BY nombre ASC
    `;

    // Transformamos el RowList en un Array estándar
    return data.map(row => ({
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      slug: row.slug
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('No se pudieron cargar las categorías.');
  }
}

// READ: Obtener una categoría por su slug (para la página de categoría)
export async function fetchCategoryBySlug(slug: string) {
  try {
    const category = await sql`
      SELECT * FROM categories 
      WHERE slug = ${slug} 
      LIMIT 1
    `;
    return category[0];
  } catch (error) {
    throw new Error('Categoría no encontrada.');
  }
}