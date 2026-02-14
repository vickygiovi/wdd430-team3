import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// READ: Obtener todos los usuarios
export async function fetchUsers() {
  try {
    const users = await sql`
      SELECT id, username, email, full_name, role, avatar_url, is_active 
      FROM users 
      ORDER BY created_at DESC
    `;
    return users;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Fallo al obtener usuarios.');
  }
}

// READ: Obtener un usuario por ID
export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email = ${email}`;
    return user[0]; // Retorna el usuario o undefined
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    throw new Error('Fallo al buscar el usuario.');
  }
}