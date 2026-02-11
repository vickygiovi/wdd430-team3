import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Obtener todas las historias publicadas (con el nombre del artesano)
export async function fetchPublishedStories() {
  try {
    const stories = await sql`
      SELECT s.*, u.full_name as artesano_nombre, u.avatar_url as artesano_avatar
      FROM stories s
      JOIN users u ON s.artesano_id = u.id
      WHERE s.publicado = true
      ORDER BY s.created_at DESC
    `;
    return stories;
  } catch (error) {
    throw new Error('Error al cargar las historias.');
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
    throw new Error('Error al cargar tus historias.');
  }
}