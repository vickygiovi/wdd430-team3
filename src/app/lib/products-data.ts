import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export interface Product {
  id: string,
  name: string,
  price: number,
  stock: number,
  available: boolean,
  description: string,
  category_id: string,
  size?: string,
  color?: string,
  keywords?: string[],
  main_image: string,
  imagenes_galeria: string[],
  artesano_id?: string,
  category_name?: string,
  artisan_name: string
}
// interface ProductFiltered {
//   id: string;
//   artesano_id: string;
//   nombre: string;
//   descripcion: string;
//   precio: number | string;
//   imagen_principal: string; // Nombre real en tu DDL
//   imagenes_galeri: string[]; // Nombre real en tu DDL
//   stock: number;
//   is_available: boolean;
//   category_id: string;
//   keywords: string[];
//   size: string | null;
//   color: string | null;
//   categoria_nombre: string; // Del LEFT JOIN
//   artisan_name?: string; // Asegúrate de tener este campo en el SELECT o JOIN
// }

// READ: Obtener todos los productos con el nombre de su categoría y nuevos campos
export async function fetchProducts() {
  try {
    const data = await sql`
      SELECT 
        p.*, 
        c.nombre as categoria_nombre 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    // Al usar p.* ya incluimos automáticamente keywords, size y color
    return data.map(row => ({
      id: row.id,
      name: row.nombre,             // Ajusta 'nombre' si en tu DB se llama 'name'
      price: parseFloat(row.precio), // Asegura que sea número (Postgres suele devolver decimales como string)
      stock: parseInt(row.stock),   
      available: row.is_available,  // Ajusta al nombre exacto de tu columna
      description: row.descripcion, 
      category_id: row.category_id,
      
      // Campos opcionales (si son null en DB, pasan como undefined o se mantienen)
      size: row.size ?? undefined,
      color: row.color ?? undefined,
      keywords: row.keywords || [], // Si es null, devuelve un array vacío para evitar errores
      
      // Imágenes
      main_image: row.imagen_principal_url,
      imagenes_galeria: row.imagenes_galeria || [],
      artesano_id: row.artesano_id
    }));
  } catch (error) {
    console.error('Error:', error);
    throw new Error('No se pudieron cargar los productos.');
  }
}

// READ: Obtener un solo producto por ID (incluye keywords, size y color)
export async function fetchProductById(id: string) {

  console.log("Buscando ID:", id);

  try {
    const data = await sql`
      SELECT 
      p.*, 
      c.nombre AS category_name, 
      a.username AS artisan_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users a ON p.artesano_id = a.id
      WHERE p.id = ${id}
    `;

    const products = data.map(row => ({
      id: row.id,
      name: row.nombre,             // Ajusta 'nombre' si en tu DB se llama 'name'
      price: parseFloat(row.precio), // Asegura que sea número (Postgres suele devolver decimales como string)
      stock: parseInt(row.stock),   
      available: row.is_available,  // Ajusta al nombre exacto de tu columna
      description: row.descripcion, 
      category_id: row.category_id,
      
      // Campos opcionales (si son null en DB, pasan como undefined o se mantienen)
      size: row.size ?? undefined,
      color: row.color ?? undefined,
      keywords: row.keywords || [], // Si es null, devuelve un array vacío para evitar errores
      
      // Imágenes
      main_image: row.imagen_principal_url,
      imagenes_galeria: row.imagenes_galeria || [],
      category_name: row.category_name,
      artisan_name: row.artisan_name
    }));
    
    return products[0];
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
  categoryIds,
  minPrice,
  maxPrice,
  keyword,
  size,
  color,
  sortBy, // Nuevo parámetro: 'date', 'price_asc', 'price_desc'
  searchName,
}: {
  categoryIds?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
  size?: string;
  color?: string;
  sortBy?: string; // Agregamos el tipo aquí
  searchName?: string;
}) {
  try {

    let finalIds: string[] = [];
    
    if (categoryIds) {
      if (Array.isArray(categoryIds)) {
        // Si ya es un array, nos aseguramos de que no haya strings con comas adentro
        finalIds = categoryIds.flatMap(id => id.split(',')).filter(Boolean);
      } else if (typeof categoryIds === 'string') {
        // Si es un string "id1,id2", lo rompemos en un array real
        finalIds = categoryIds.split(',').filter(Boolean);
      }
    }

    // Eliminamos duplicados por seguridad
    finalIds = [...new Set(finalIds)];

    console.log("finalids", finalIds)

    // Definimos el mapeo de ordenamiento por seguridad
    let orderByClause = sql`ORDER BY p.created_at DESC`; // Orden por defecto

    if (sortBy === 'price_asc') {
      orderByClause = sql`ORDER BY p.precio ASC`;
    } else if (sortBy === 'price_desc') {
      orderByClause = sql`ORDER BY p.precio DESC`;
    } else if (sortBy === 'date_asc') {
      orderByClause = sql`ORDER BY p.created_at ASC`;
    }

    const products = await sql`
      SELECT p.*, c.nombre as categoria_nombre 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
      ${
        finalIds.length > 0 
          ? sql`AND p.category_id IN ${sql(finalIds)}` // Fíjate: IN ${sql(finalIds)} sin paréntesis manuales
          : sql``
      }
      ${minPrice ? sql`AND p.precio >= ${minPrice}` : sql``}
      ${maxPrice ? sql`AND p.precio <= ${maxPrice}` : sql``}
      ${size ? sql`AND p.size = ${size}` : sql``}
      ${color ? sql`AND p.color = ${color}` : sql``}
      ${
        searchName 
          ? sql`AND p.nombre ILIKE ${'%' + searchName + '%'}` 
          : sql``
      }
      ${keyword ? sql`AND ${keyword} = ANY(p.keywords)` : sql``}
      ${orderByClause}
    `;

    return products.map((row) => ({
      id: row.id,
      name: row.nombre,
      price: Number(row.precio) || 0,
      description: row.descripcion || "",
      main_image: row.imagen_principal_url, // Ajustado según DDL
      imagenes_galeria: row.imagenes_galeria || [], // Ajustado según DDL
      artisan_name: row.artisan_name || "Artesano Desconocido", 
      category_name: row.categoria_nombre,
      stock: row.stock || 0,
      size: row.size,
      color: row.color,
      keywords: row.keywords || [],
    }));
  } catch (error) {
    console.error('Error al filtrar productos:', error);
    throw new Error('No se pudieron aplicar los filtros.');
  }
}