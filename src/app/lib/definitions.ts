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