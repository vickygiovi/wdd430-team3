import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const USERS_TO_SEED = [
  {
    username: 'cliente_user',
    email: 'cliente@ejemplo.com',
    password: 'password123',
    full_name: 'Cliente Random',
    role: 'cliente',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cliente',
    bio: 'Soy un cliente en busca de artesanías únicas.',
    is_active: true
  },
  {
    username: 'artesano_juan',
    email: 'juan@taller.com',
    password: 'juan_artesano_seguro',
    full_name: 'Juan Pérez',
    role: 'artesano',
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
    bio: 'Maestro carpintero con 20 años de experiencia.',
    is_active: true
  }
];

const CATEGORIES_TO_SEED = [
  {
    nombre: 'Cerámica',
    descripcion: 'Piezas únicas hechas a mano con barro y arcilla de la región, cocidas en horno de alta temperatura para mayor durabilidad.',
    slug: 'ceramica'
  },
  {
    nombre: 'Textiles',
    descripcion: 'Tejidos artesanales elaborados en telar manual con fibras naturales como algodón orgánico y lana de oveja teñida artesanalmente.',
    slug: 'textiles'
  },
  {
    nombre: 'Madera',
    descripcion: 'Tallas y muebles de maderas nativas sostenibles, acabados con aceites naturales y técnicas de carpintería tradicional.',
    slug: 'madera'
  },
  {
    nombre: 'Joyería',
    descripcion: 'Accesorios exclusivos diseñados con metales preciosos y piedras semipreciosas utilizando técnicas de filigrana y martillado.',
    slug: 'joyeria'
  }
];

const PRODUCTS_TO_SEED = [
  {
    artesano_username: 'artesano_juan',
    categoria_nombre: 'Madera',
    nombre: 'Mesa de Centro Rústica',
    descripcion: 'Mesa tallada a mano en madera de roble con acabados de aceite natural.',
    precio: 250.00,
    imagen_principal_url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88',
    imagenes_galeria: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88',
      'https://images.unsplash.com/photo-1554034483-04fda0d3507b'
    ],
    stock: 5,
    is_available: true
  },
  {
    artesano_username: 'artesano_juan',
    categoria_nombre: 'Cerámica',
    nombre: 'Jarrón de Barro Negro',
    descripcion: 'Jarrón artesanal cocido en fosa, técnica tradicional de pulido.',
    precio: 45.99,
    imagen_principal_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61',
    imagenes_galeria: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61'],
    stock: 12,
    is_available: true
  }
];

const REVIEWS_TO_SEED = [
  {
    product_nombre: 'Jarrón de Barro Negro',
    username: 'cliente_user',
    rating: 5,
    comment: 'Una pieza espectacular, se nota la dedicación del artesano en cada detalle.'
  },
  {
    product_nombre: 'Mesa de Centro Rústica',
    username: 'cliente_user',
    rating: 4,
    comment: 'La madera es de gran calidad, aunque el envío tardó un poco más de lo esperado.'
  }
];

const STORIES_TO_SEED = [
  {
    artesano_username: 'artesano_juan',
    titulo: 'El arte de trabajar el Roble',
    contenido: 'Hoy les muestro cómo seleccionamos la madera caída para darle una segunda vida en forma de esculturas únicas.',
    imagen_url: 'https://images.unsplash.com/photo-1589519160732-57fc498494f8',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', // Ejemplo de video
    publicado: true,
    likes_count: 15
  },
  {
    artesano_username: 'artesano_juan',
    titulo: 'Secretos del Barro Negro',
    contenido: 'Un vistazo al proceso de bruñido manual que le da ese brillo metálico tan especial a nuestras piezas.',
    imagen_url: 'https://images.unsplash.com/photo-1565191999001-551c187427bb',
    video_url: null, // Campo opcional que admite NULL
    publicado: true,
    likes_count: 42
  }
];

export async function GET() {
  try {
    const results = {
      users: 0,
      categories: 0,
      products: 0,
      reviews: 0,
      stories: 0,
    };

    // --- 1. INSERTAR USUARIOS (Secuencialmente) ---
    for (const user of USERS_TO_SEED) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      await sql`
        INSERT INTO users (
          username, 
          email, 
          password_hash, 
          full_name, 
          role, 
          avatar_url, 
          bio, 
          is_active
        ) VALUES (
          ${user.username}, 
          ${user.email}, 
          ${hashedPassword}, 
          ${user.full_name}, 
          ${user.role}, 
          ${user.avatar_url}, 
          ${user.bio}, 
          ${user.is_active}
        );
      `;
      results.users++;
    }

    // --- 2. INSERTAR CATEGORÍAS (Secuencialmente) ---
    for (const category of CATEGORIES_TO_SEED) {
      await sql`
        INSERT INTO categories (
          nombre, 
          descripcion, 
          slug
        ) VALUES (
          ${category.nombre}, 
          ${category.descripcion}, 
          ${category.slug}
        );
      `;
      results.categories++;
    }

    // --- 3. INSERTAR PRODUCTOS (Buscando IDs por nombre/username) ---
    for (const prod of PRODUCTS_TO_SEED) {
      // Verificamos el ID del artesano por su username
      const [artisan] = await sql`SELECT id FROM users WHERE username = ${prod.artesano_username} LIMIT 1`;
      
      // Verificamos el ID de la categoría por su nombre
      const [category] = await sql`SELECT id FROM categories WHERE nombre = ${prod.categoria_nombre} LIMIT 1`;

      if (artisan && category) {
        await sql`
          INSERT INTO products (
            artesano_id,
            category_id,
            nombre,
            descripcion,
            precio,
            imagen_principal_url,
            imagenes_galeria,
            stock,
            is_available
          ) VALUES (
            ${artisan.id}, 
            ${category.id}, 
            ${prod.nombre}, 
            ${prod.descripcion}, 
            ${prod.precio}, 
            ${prod.imagen_principal_url}, 
            ${prod.imagenes_galeria}, 
            ${prod.stock}, 
            ${prod.is_available}
          );
        `;
        results.products++;
      } else {
        console.warn(`No se pudo insertar "${prod.nombre}": Artesano o Categoría no encontrados.`);
      }
    }

    // --- 4. INSERTAR REVIEWS (Verificando IDs por Nombre y Username) ---
    for (const rev of REVIEWS_TO_SEED) {
      // Buscamos el ID del producto por su nombre
      const [product] = await sql`SELECT id FROM products WHERE nombre = ${rev.product_nombre} LIMIT 1`;
      
      // Buscamos el ID del usuario que hace la reseña
      const [user] = await sql`SELECT id FROM users WHERE username = ${rev.username} LIMIT 1`;

      if (product && user) {
        await sql`
          INSERT INTO reviews (
            product_id,
            user_id,
            rating,
            comment
          ) VALUES (
            ${product.id},
            ${user.id},
            ${rev.rating},
            ${rev.comment}
          );
        `;
        results.reviews++;
      } else {
        console.warn(`Omitiendo reseña: No se encontró el producto o el usuario.`);
      }
    }

    // --- 5. INSERTAR STORIES (Verificando ID por Username) ---
    for (const story of STORIES_TO_SEED) {
        // Buscamos el ID del artesano dueño de la historia
        const [artisan] = await sql`
            SELECT id FROM users 
            WHERE username = ${story.artesano_username} 
            LIMIT 1
        `;

        if (artisan) {
            await sql`
                INSERT INTO stories (
                    artesano_id,
                    titulo,
                    contenido,
                    imagen_url,
                    video_url,
                    publicado,
                    likes_count
                ) VALUES (
                    ${artisan.id},
                    ${story.titulo},
                    ${story.contenido},
                    ${story.imagen_url},
                    ${story.video_url},
                    ${story.publicado},
                    ${story.likes_count}
                );
            `;
            results.stories++;
        } else {
            console.warn(`Omitiendo historia: No se encontró al artesano ${story.artesano_username}`);
        }
    }

    return Response.json({ 
      success: true,
      message: "Seed completado con éxito", 
      details: results 
    });

  } catch (error) {
    console.error("Error en el seed:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
