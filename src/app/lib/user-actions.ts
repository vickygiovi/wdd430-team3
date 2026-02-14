'use server';

import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getUser } from './user-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export interface AuthState {
  error?: string;
}

export async function authenticate(prevState: AuthState | undefined | null, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // 1. Buscar al usuario
  const user = await getUser(email);

  if (!user) {
    return { error: 'Credenciales inválidas.' };
  }

  // 2. Verificar si está activo (columna is_active de tu DB)
  if (!user.is_active) {
    return { error: 'Esta cuenta ha sido desactivada.' };
  }

  // 3. Comparar contraseñas
  const passwordsMatch = await bcrypt.compare(password, user.password_hash);

  if (passwordsMatch) {
    // 4. AQUÍ CREAS LA SESIÓN
    // Si usas Auth.js (NextAuth), llamarías a signIn('credentials', ...)
    // Si lo haces manual, guardarías un JWT en una cookie:
    // cookies().set('session', token, { httpOnly: true });

    console.log('Usuario autenticado:', user.email);
    redirect('/'); // Login exitoso
  } else {
    return { error: 'Contraseña incorrecta.' };
  }
}

// CREATE: Crear usuario
export async function createUser(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  
  // Hash de la contraseña (60 caracteres para tu columna password_hash)
  const hashedPassword = await bcrypt.hash(rawFormData.password as string, 10);

  try {
    await sql`
      INSERT INTO users (
        username, email, password_hash, full_name, role
      ) VALUES (
        ${rawFormData.username as string}, 
        ${rawFormData.email as string}, 
        ${hashedPassword}, 
        ${rawFormData.full_name as string}, 
        ${rawFormData.role as string || 'artesano'}
      )
    `;
  } catch (error) {
    console.log({ message: 'Database Error: Error al crear usuario.' });
  }

  revalidatePath('/login'); // Actualiza la lista de usuarios
  redirect('/login');
}

// UPDATE: Actualizar usuario
export async function updateUser(id: string, formData: FormData) {
  const { full_name, bio, avatar_url, role } = Object.fromEntries(formData.entries());

  try {
    await sql`
      UPDATE users
      SET 
        full_name = ${full_name as string},
        bio = ${bio as string},
        avatar_url = ${avatar_url as string},
        role = ${role as string},
        updated_at = now()
      WHERE id = ${id}
    `;
  } catch (error) {
    console.log({ message: 'Error al actualizar usuario.' });
  }

  revalidatePath('/profile');
  redirect('/profile?success=true');
}

// DELETE: Borrado lógico (recomendado por tu columna is_active)
export async function deleteUser(id: string) {
  try {
    await sql`UPDATE users SET is_active = false WHERE id = ${id}`;
    revalidatePath('/'); 
    console.log({ message: 'Usuario desactivado.' });
  } catch (error) {
    console.log({ message: 'Error al eliminar usuario.' });
  }
}