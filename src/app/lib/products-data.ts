import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// READ: Obtener todos los productos con el nombre de su categoría y nuevos campos
export async function fetchProducts() {
  try {
    const products = await sql`
      SELECT 
        p.*, 
        c.nombre as categoria_nombre 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    // Al usar p.* ya incluimos automáticamente keywords, size y color
    return products;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('No se pudieron cargar los productos.');
  }
}

// READ: Obtener un solo producto por ID (incluye keywords, size y color)
export async function fetchProductById(id: string) {
  try {
    const product = await sql`SELECT * FROM products WHERE id = ${id}`;
    return product[0];
  } catch (error) {
    throw new Error('Producto no encontrado.');
  }
}

// READ: Producto por ID con Reviews y nombres de usuarios
export async function fetchProductByIdWithReviews(id: string) {
  try {
    const data = await sql`
      SELECT 
        p.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', r.id,
              'rating', r.rating,
              'comment', r.comment,
              'created_at', r.created_at,
              'author_name', u.full_name,  -- Obtenido del JOIN con users
              'author_avatar', u.avatar_url -- Obtenido del JOIN con users
            )
          ) FILTER (WHERE r.id IS NOT NULL), 
          '[]'
        ) AS reviews
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      LEFT JOIN users u ON r.user_id = u.id -- Unimos las reseñas con los usuarios
      WHERE p.id = ${id}
      GROUP BY p.id;
    `;

    if (data.length === 0) return null;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener el producto detallado.');
  }
}

/**
 * Obtiene el catálogo completo de un artesano incluyendo los nuevos detalles técnicos.
 * @param artesanoId - El UUID del artesano
 */
export async function fetchProductsByArtesano(artesanoId: string) {
  try {
    const products = await sql`
      SELECT 
        p.id,
        p.nombre,
        p.precio,
        p.stock,
        p.imagen_principal_url,
        p.is_available,
        p.keywords,  -- Nuevo campo array
        p.size,      -- Nuevo campo texto
        p.color,     -- Nuevo campo texto
        p.created_at,
        c.nombre AS categoria_nombre
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      WHERE p.artesano_id = ${artesanoId}
      ORDER BY p.created_at DESC
    `;

    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('No se pudieron cargar los productos del artesano.');
  }
}

export async function fetchFilteredProducts({
  categoryId,
  minPrice,
  maxPrice,
  keyword,
  size,
  color,
}: {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
  size?: string;
  color?: string;
}) {
  try {
    // Iniciamos la consulta base
    const products = await sql`
      SELECT p.*, c.nombre as categoria_nombre 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
      ${categoryId ? sql`AND p.category_id = ${categoryId}` : sql``}
      ${minPrice ? sql`AND p.precio >= ${minPrice}` : sql``}
      ${maxPrice ? sql`AND p.precio <= ${maxPrice}` : sql``}
      ${size ? sql`AND p.size = ${size}` : sql``}
      ${color ? sql`AND p.color = ${color}` : sql``}
      ${keyword ? sql`AND ${keyword} = ANY(p.keywords)` : sql``}
      ORDER BY p.created_at DESC
    `;

    return products;
  } catch (error) {
    console.error('Error al filtrar productos:', error);
    throw new Error('No se pudieron aplicar los filtros.');
  }
}