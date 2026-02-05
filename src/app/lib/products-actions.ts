'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/**
 * Procesa el string de keywords para convertirlo en un array limpio
 */
const parseKeywords = (raw: string | null): string[] => {
  if (!raw) return [];
  return raw.split(',').map(k => k.trim()).filter(k => k !== "");
};

// CREATE: Nuevo Producto con especificaciones completas
export async function createProduct(formData: FormData) {
  // Extraemos datos según el esquema
  const artesano_id = formData.get('artesano_id') as string;
  const category_id = formData.get('category_id') as string;
  const nombre = formData.get('nombre') as string;
  const descripcion = formData.get('descripcion') as string;
  const precio = parseFloat(formData.get('precio') as string || '0');
  const stock = parseInt(formData.get('stock') as string || '0');
  const imagen_principal_url = formData.get('imagen_principal_url') as string;
  const is_available = formData.get('is_available') === 'on';
  
  // Nuevos campos y arrays
  const size = formData.get('size') as string;
  const color = formData.get('color') as string;
  const keywords = parseKeywords(formData.get('keywords') as string);
  const imagenes_galeria = parseKeywords(formData.get('imagenes_galeria') as string);

  try {
    await sql`
      INSERT INTO products (
        artesano_id, category_id, nombre, descripcion, precio, 
        imagen_principal_url, imagenes_galeria, stock, is_available,
        keywords, size, color
      ) VALUES (
        ${artesano_id}, ${category_id}, ${nombre}, ${descripcion}, ${precio}, 
        ${imagen_principal_url}, ${imagenes_galeria}, ${stock}, ${is_available},
        ${keywords}, ${size}, ${color}
      )
    `;
  } catch (error) {
    console.error('Error DB:', error);
    console.error({ message: 'Error al crear el producto.' });
  }

  revalidatePath('/products');
  redirect('/products');
}

// UPDATE: Actualizar producto existente
export async function updateProduct(id: string, formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const descripcion = formData.get('descripcion') as string;
  const precio = parseFloat(formData.get('precio') as string);
  const stock = parseInt(formData.get('stock') as string);
  const is_available = formData.get('is_available') === 'on';
  const category_id = formData.get('category_id') as string;
  
  // Actualización de campos técnicos
  const size = formData.get('size') as string;
  const color = formData.get('color') as string;
  const keywords = parseKeywords(formData.get('keywords') as string);

  try {
    await sql`
      UPDATE products
      SET 
        nombre = ${nombre},
        descripcion = ${descripcion},
        precio = ${precio},
        stock = ${stock},
        is_available = ${is_available},
        category_id = ${category_id},
        size = ${size},
        color = ${color},
        keywords = ${keywords},
        updated_at = now()
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error({ message: 'Error al actualizar el producto.', error });
  }

  revalidatePath(`/products`);
  redirect('/products');
}

// DELETE: Borrado físico del producto
export async function deleteProduct(id: string) {
  try {
    await sql`DELETE FROM products WHERE id = ${id}`;
    revalidatePath('/products');
  } catch (error) {
    console.error({ message: 'No se pudo eliminar el producto.', error });
  }
}