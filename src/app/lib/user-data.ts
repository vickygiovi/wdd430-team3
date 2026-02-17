import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export interface User {
  id: string; // uuid
  username: string; // character varying(50)
  email: string; // character varying(255)
  password_hash: string; // character varying(60)
  
  // Estos campos permiten NULL según los interruptores en la imagen
  full_name?: string | null; // character varying(100)
  avatar_url?: string | null; // character varying(255)
  bio?: string | null; // text
  
  // Campos con valores por defecto
  role: string; // character varying(20), default: 'artesanc...'
  is_active: boolean; // boolean, default: true
  
  // Timestamps
  created_at: Date | string; // timestamp with time zone
  updated_at: Date | string; // timestamp with time zone
}

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

export async function getUser(email: string): Promise<User> {
  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;


    const row = result[0];

    // Mapeo manual para asegurar que los tipos coincidan con la interfaz User
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      password_hash: row.password_hash,
      full_name: row.full_name,
      avatar_url: row.avatar_url,
      bio: row.bio,
      role: row.role,
      is_active: Boolean(row.is_active), // Aseguramos conversión a boolean
      created_at: new Date(row.created_at), // Convertimos el timestamp a objeto Date
      updated_at: new Date(row.updated_at),
    };

  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    throw new Error('Fallo al buscar el usuario.');
  }
}