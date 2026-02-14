import postgres from "postgres";
import { Article } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// Obtener todas las historias publicadas (con el nombre del artesano)
export async function fetchPublishedStories() {
  try {
    const stories = await sql`
      SELECT s.id,
      s.artesano_id,
      s.titulo,
      s.contenido,
      s.imagen_url,
      s.video_url,
      s.publicado,
      s.likes_count,
      s.created_at,
      s.updated_at,
      s.tags,
      s.post,
      u.full_name as artesano_nombre,
      u.avatar_url as artesano_avatar
    FROM stories s
    JOIN users u ON s.artesano_id = u.id
    WHERE s.publicado = true
    ORDER BY s.created_at DESC
    `;
    return stories.map(
      (row): Article => ({
        id: row.id,
        artesano_id: row.artesano_id,
        full_name: row.artesano_nombre, // Mapeo del alias SQL a la interfaz
        avatar_url: row.artesano_avatar, // Mapeo del alias SQL a la interfaz
        titulo: row.titulo,
        contenido: row.contenido,
        imagen_url: row.imagen_url,
        video_url: row.video_url,
        publicado: row.publicado,
        likes_count: row.likes_count,
        created_at: row.created_at,
        updated_at: row.updated_at,
        tags: row.tags,
        post: row.post,
      }),
    );
  } catch (error) {
    console.error("Database Error:", error); // Esto te dirá si falta una columna o hay un error de sintaxis
    throw new Error("Error al cargar las historias.");
  }
}

// Obtener historias de un artesano específico
export async function fetchStoriesByArtesano(artesanoId: string) {
  try {
    return await sql`
      SELECT * FROM stories 
      WHERE artesano_id = ${artesanoId} 
      ORDER BY created_at DESC
    `;
  } catch (error) {
    throw new Error("Error al cargar tus historias.");
  }
}
