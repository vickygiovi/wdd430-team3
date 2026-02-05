'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// CREATE: Nueva categoría
export async function createCategory(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const descripcion = formData.get('descripcion') as string;
  
  // Generar slug básico (ej: "Barro Negro" -> "barro-negro")
  const slug = nombre.toLowerCase().trim().replace(/\s+/g, '-');

  try {
    await sql`
      INSERT INTO categories (nombre, descripcion, slug)
      VALUES (${nombre}, ${descripcion}, ${slug})
    `;
  } catch (error) {
    return { message: 'Error: El nombre o el slug ya existen.' };
  }

  revalidatePath('/categories');
  redirect('/categories');
}

// UPDATE: Editar categoría
export async function updateCategory(id: string, formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const descripcion = formData.get('descripcion') as string;
  const slug = formData.get('slug') as string;

  try {
    await sql`
      UPDATE categories
      SET 
        nombre = ${nombre},
        descripcion = ${descripcion},
        slug = ${slug}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Error al actualizar la categoría.' };
  }

  revalidatePath('/categories');
  redirect('/categories');
}

// DELETE: Eliminar categoría
export async function deleteCategory(id: string) {
  try {
    await sql`DELETE FROM categories WHERE id = ${id}`;
    revalidatePath('/categories');
  } catch (error) {
    // Esto fallará si hay productos vinculados a esta categoría
    return { message: 'No se puede eliminar: tiene productos asociados.' };
  }
}