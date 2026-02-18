'use server';

import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getUser } from './user-data';
import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function saveFile(file: File, folder: string): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Crear un nombre único para evitar duplicados
  const safeName = file.name.replaceAll(" ", "_");
  const fileName = `${crypto.randomUUID()}-${safeName}`;
  const relativePath = `/uploads/${folder}/${fileName}`;
  const absolutePath = path.join(process.cwd(), 'public', relativePath);

  // Asegurarse de que el directorio existe
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  
  // Guardar el archivo
  await fs.writeFile(absolutePath, buffer);
  
  return relativePath; // Esto es lo que guardaremos en la DB
}

const RegisterSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(60),
  full_name: z.string().max(100).optional().or(z.literal('')),
  bio: z.string().optional().or(z.literal('')),
  role: z.enum(['artesano', 'cliente']).default('artesano'),
});

export type RegisterState = {
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

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

export async function registerUser(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  // 1. Validamos los campos de texto
  const validatedFields = RegisterSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    full_name: formData.get('full_name'),
    bio: formData.get('bio'),
    role: formData.get('role'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Por favor, revisa los campos marcados.',
    };
  }

  const { username, email, password, full_name, bio, role } = validatedFields.data;

  // 2. Extraemos el archivo del FormData
  const avatarFile = formData.get('avatar_file') as File | null;
  let finalAvatarUrl = null;

  try {
    // 3. Si hay un archivo, lo subimos usando tu función saveFile
    if (avatarFile && avatarFile.size > 0) {
      // Usamos 'avatars' como carpeta de destino
      finalAvatarUrl = await saveFile(avatarFile, 'avatars');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Inserción en la base de datos
    await sql`
      INSERT INTO users (
        username, 
        email, 
        password_hash, 
        full_name, 
        avatar_url, 
        bio, 
        role
      ) VALUES (
        ${username}, 
        ${email}, 
        ${hashedPassword}, 
        ${full_name || null}, 
        ${finalAvatarUrl}, 
        ${bio || null}, 
        ${role}
      )
    `;
  } catch (error: unknown) {
    console.log("ERROR REAL DETECTADO:", error);
    if (
      error !== null &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === '23505'
    ) {
      return { message: 'El usuario o email ya existe.' };
    }

    console.error('Database Error:', error);
    return {
      message: 'Error de base de datos: No se pudo crear la cuenta.',
    };
  }

  revalidatePath('/login');
  redirect('/login');
}