export interface Article {
  // Campos Primary Key y Foreign Key (UUIDs)
  id: string; 
  artesano_id: string;

  // Información del Autor (Nuevos campos)
  full_name: string;   // Nombre completo del artesano
  avatar_url: string;  // URL de la imagen de perfil del artesano

  // Contenido
  titulo: string;
  contenido: string;
  
  // URLs (Strings que no pueden ser nulas ni vacías según tu requerimiento)
  imagen_url: string; 
  video_url: string;

  // Estados y contadores
  publicado: boolean;
  likes_count: number;

  // Fechas (Se recomienda string para ISO 8601 o Date si las transformas)
  created_at: string | Date;
  updated_at: string | Date;

  tags: string[];

  post: string;
};

// app/lib/definitions.ts o src/app/lib/definitions.ts
export type User = {
  id: string; // uuid
  username: string;
  email: string;
  password_hash: string; // En tu DDL es character varying(60)
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  role: 'artesano' | 'cliente'; // Basado en tu default 'artesano'
  is_active: boolean;
};