'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import crypto from 'crypto';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

import { promises as fs } from 'fs';
import path from 'path';

// Función auxiliar para guardar archivos
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

// 1. Definimos el esquema de validación
const CreateProduct = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  price: z.coerce.number().gt(0, "El precio debe ser mayor a 0"),
  description: z.string().min(5, "La descripción es muy corta"),
  category_id: z.preprocess(
    (val) => val ?? "", // Si es null o undefined, lo convierte en ""
    z.string().min(1, "Por favor selecciona una categoría")
  ),
  stock: z.coerce
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
  mainImageFile: z
    .any()
    .refine((file) => file?.size > 0, "La imagen principal es obligatoria"),
  is_available: z.coerce.boolean(),
  size: z.string().optional(),
  color: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  galleryFiles: z
    .array(z.instanceof(File))
    .min(1, "Debes subir al menos una imagen para la galería")
    .refine(
      (files) => files.every((file) => file.size > 0),
      "Uno o más archivos están corruptos o vacíos"
    ),
});

const UpdateProduct = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  price: z.coerce.number().gt(0, "El precio debe ser mayor a 0"),
  description: z.string().min(5, "La descripción es muy corta"),
  category_id: z.preprocess(
    (val) => val ?? "", // Si es null o undefined, lo convierte en ""
    z.string().min(1, "Por favor selecciona una categoría")
  ),
  stock: z.coerce
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
  mainImageFile: z
    .any()
    .refine((file) => file?.size > 0, "La imagen principal es obligatoria"),
  is_available: z.coerce.boolean(),
  size: z.string().optional(),
  color: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  galleryFiles: z
    .array(z.instanceof(File))
    .min(1, "Debes subir al menos una imagen para la galería")
    .refine(
      (files) => files.every((file) => file.size > 0),
      "Uno o más archivos están corruptos o vacíos"
    ),
});

export type State = {
  errors?: {
    name?: string[];        // Antes era customerId
    price?: string[];       // Antes era amount
    description?: string[]; // Antes era status
    category_id?: string[]; // Nuevo campo para categoría
    galleryFiles?: string[];      // Opcional, si validas imágenes
    stock?: string[];
    mainImageFile?: string[];
    is_available?: string[];
    size?: string[];
    color?: string[];
    keywords?: string[];
  };
  message?: string | null;
};

export type StateUpdatingProduct = {
  errors?: {
    id?: string[];
    name?: string[];        // Antes era customerId
    price?: string[];       // Antes era amount
    description?: string[]; // Antes era status
    category_id?: string[]; // Nuevo campo para categoría
    galleryFiles?: string[];      // Opcional, si validas imágenes
    stock?: string[];
    mainImageFile?: string[];
    is_available?: string[];
    size?: string[];
    color?: string[];
    keywords?: string[];
  };
  message?: string | null;
};

export type StateDeletingProduct = {
  message?: string | null;
  error?: boolean;
};

/**
 * Procesa el string de keywords para convertirlo en un array limpio
 */
const parseKeywords = (raw: string | null): string[] => {
  if (!raw) return [];
  return raw.split(',').map(k => k.trim()).filter(k => k !== "");
};

// CREATE: Nuevo Producto con especificaciones completas
// export async function createProduct(prevState: State, formData: FormData): Promise<State> {
//   const validatedFields = CreateProduct.safeParse({
//     name: formData.get('nombre'),
//     price: formData.get('precio'),
//     description: formData.get('descripcion'),
//     category_id: formData.get('category_id'),
//     stock: formData.get('stock'),
//     is_available: formData.get('is_available') === 'on',
//     size: formData.get('size')?.toString() || null, // Convertir vacío a null
//     color: formData.get('color')?.toString() || null,
//     keywords: parseKeywords(formData.get('keywords')?.toString() || ""),
//     mainImageFile: formData.get('imagen_principal'),
//     galleryFiles: formData.getAll('imagenes_galeria').filter((entry): entry is File => entry instanceof File && entry.size > 0)
//   });

//   // Si la validación falla, devolvemos los errores específicos
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Faltan campos. No se pudo crear el producto.',
//     };
//   }

//   // Extraemos datos según el esquema
//   const { name, price, description, category_id, stock, is_available, size, color, keywords, mainImageFile, galleryFiles } = validatedFields.data;

//   const artesano_id = 'a239e0e7-70d2-47f9-83f7-d0a7e33e5850';
  
//   // 1. Obtener archivos del FormData
//   const mainImageFileEntrySQL = mainImageFile as File;
//   const galleryFilesEntrySQL = galleryFiles as File[]; // Nota el getAll

//   let main_image_url = '';
//   const gallery_urls: string[] = [];

//   try {

//     // 2. Guardar imagen principal físicamente
//     if (mainImageFile && mainImageFile.size > 0) {
//       main_image_url = await saveFile(mainImageFile, 'main');
//     }

//     // 3. Guardar galería físicamente
//     for (const file of galleryFiles) {
//       if (file.size > 0) {
//         const url = await saveFile(file, 'gallery');
//         gallery_urls.push(url);
//       }
//     }

//     await sql`
//       INSERT INTO products (
//         artesano_id, category_id, nombre, descripcion, precio, 
//         imagen_principal_url, imagenes_galeria, stock, is_available,
//         keywords, size, color
//       ) VALUES (
//         ${artesano_id}, ${category_id}, ${name}, ${description}, ${price}, 
//         ${main_image_url}, ${gallery_urls}, ${stock}, ${is_available},
//         ${keywords || []}, ${size ?? null}, ${color ?? null}
//       )
//     `;
//   } catch (error) {
//     console.error('Error DB:', error);
//     console.error({ message: 'Error al crear el producto.' });
//   }

//   revalidatePath('/products');
//   redirect('/products');
// }

export async function createProduct(prevState: State, formData: FormData): Promise<State> {
  console.log(
    'imagenes_galeria ->',
    formData.getAll('imagenes_galeria'),
    'length:',
    formData.getAll('imagenes_galeria').length
  );

  // 1. Pre-procesamiento de archivos (Limpiamos los archivos vacíos antes de validar)
  const rawMainImage = formData.get('imagen_principal');
  const mainImageFile = (rawMainImage instanceof File && rawMainImage.size > 0) ? rawMainImage : null;

  const galleryFiles = formData.getAll('imagenes_galeria').filter(
    (entry): entry is File => entry instanceof File && entry.size > 0
  );

  // 2. Validación con Zod
  const validatedFields = CreateProduct.safeParse({
    name: formData.get('nombre'),
    price: formData.get('precio'), // Deja que Zod lo convierta vía coerce
    description: formData.get('descripcion'),
    category_id: formData.get('category_id'),
    stock: formData.get('stock'),
    is_available: formData.get('is_available') === 'on',
    size: formData.get('size')?.toString() || undefined,
    color: formData.get('color')?.toString() || undefined,
    // Pasamos el array ya procesado por parseKeywords
    keywords: parseKeywords(formData.get('keywords')?.toString() || ""),
    mainImageFile: mainImageFile, // Ahora es un File real o null
    galleryFiles: galleryFiles,   // Es un Array de Files reales
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos o el formato es incorrecto.',
    };
  }

  const { 
    name, price, description, category_id, stock, 
    is_available, size, color, keywords 
  } = validatedFields.data;

  const artesano_id = 'a239e0e7-70d2-47f9-83f7-d0a7e33e5850';
  
  try {
    // 3. Guardado de archivos optimizado
    // Guardamos la principal si existe (Zod ya validó que es obligatoria según tu esquema)
    const main_image_url = await saveFile(validatedFields.data.mainImageFile as File, 'main');

    // Guardamos la galería en paralelo
    const gallery_urls = await Promise.all(
      validatedFields.data.galleryFiles.map((file) => saveFile(file, 'gallery'))
    );

    // 4. Inserción en DB con tipado correcto para PostgreSQL
    await sql`
      INSERT INTO products (
        artesano_id, category_id, nombre, descripcion, precio, 
        imagen_principal_url, imagenes_galeria, stock, is_available,
        keywords, size, color
      ) VALUES (
        ${artesano_id}, ${category_id}, ${name}, ${description}, ${price}, 
        ${main_image_url}, ${gallery_urls}, ${stock}, ${is_available},
        ${keywords || []}, ${size ?? null}, ${color ?? null}
      )
    `;
  } catch (error) {
    console.error('Error detallado:', error);
    return {
      message: 'Error de base de datos: No se pudo crear el producto.',
    };
  }

  revalidatePath('/products');
  redirect('/products');
}

// UPDATE: Actualizar producto existente
export async function updateProduct( id: string, prevState: StateUpdatingProduct, formData: FormData): Promise<State> {

  console.log(
    'imagenes_galeria ->',
    formData.getAll('imagenes_galeria'),
    'length:',
    formData.getAll('imagenes_galeria').length
  );

  // 1. Pre-procesamiento de archivos (Limpiamos los archivos vacíos antes de validar)
  const rawMainImage = formData.get('imagen_principal');
  const mainImageFile = (rawMainImage instanceof File && rawMainImage.size > 0) ? rawMainImage : null;

  const galleryFiles = formData.getAll('imagenes_galeria').filter(
    (entry): entry is File => entry instanceof File && entry.size > 0
  );

  const validatedFields = UpdateProduct.safeParse({
    name: formData.get('nombre'),
    price: formData.get('precio'), // Deja que Zod lo convierta vía coerce
    description: formData.get('descripcion'),
    category_id: formData.get('category_id'),
    stock: formData.get('stock'),
    is_available: formData.get('is_available') === 'on',
    size: formData.get('size')?.toString() || undefined,
    color: formData.get('color')?.toString() || undefined,
    // Pasamos el array ya procesado por parseKeywords
    keywords: parseKeywords(formData.get('keywords')?.toString() || ""),
    mainImageFile: mainImageFile, // Ahora es un File real o null
    galleryFiles: galleryFiles,   // Es un Array de Files reales
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos o el formato es incorrecto.',
    };
  }

  const { 
    name, price, description, category_id, stock, 
    is_available, size, color, keywords 
  } = validatedFields.data;

  const artesano_id_sesion = 'a239e0e7-70d2-47f9-83f7-d0a7e33e5850';

  try {
    // 3. Guardado de archivos optimizado
    // Guardamos la principal si existe (Zod ya validó que es obligatoria según tu esquema)
    const main_image_url = await saveFile(validatedFields.data.mainImageFile as File, 'main');

    // Guardamos la galería en paralelo
    const gallery_urls = await Promise.all(
      validatedFields.data.galleryFiles.map((file) => saveFile(file, 'gallery'))
    );

    // 4. Inserción en DB con tipado correcto para PostgreSQL
      const result = await sql`
        UPDATE products
        SET 
          nombre = ${name},
          descripcion = ${description},
          precio = ${price},
          stock = ${stock},
          is_available = ${is_available},
          category_id = ${category_id},
          size = ${size ?? null},
          color = ${color ?? null},
          keywords = ${keywords || []},
          imagen_principal_url = ${main_image_url},
          imagenes_galeria = imagenes_galeria || ${gallery_urls},
          updated_at = now()
        WHERE id = ${id}
        AND artesano_id = ${artesano_id_sesion}
        RETURNING id
      `;

      if (result.length === 0) {
        return {
          message: 'No tienes permiso para editar este producto o el producto no existe.',
        };
      }
    } catch (error) {
      console.error({ message: 'Error al actualizar el producto.', error });
      return {
        message: 'Error de base de datos: No se pudo actualizar el producto.',
      };
    }

  revalidatePath('/products');
  redirect('/products');

  // const nombre = formData.get('nombre') as string;
  // const descripcion = formData.get('descripcion') as string;
  // const precio = parseFloat(formData.get('precio') as string);
  // const stock = parseInt(formData.get('stock') as string);
  // const is_available = formData.get('is_available') === 'on';
  // const category_id = formData.get('category_id') as string;
  
  // // Actualización de campos técnicos
  // const size = formData.get('size') as string;
  // const color = formData.get('color') as string;
  // const keywords = parseKeywords(formData.get('keywords') as string);

  // try {
    // await sql`
    //   UPDATE products
    //   SET 
    //     nombre = ${nombre},
    //     descripcion = ${descripcion},
    //     precio = ${precio},
    //     stock = ${stock},
    //     is_available = ${is_available},
    //     category_id = ${category_id},
    //     size = ${size},
    //     color = ${color},
    //     keywords = ${keywords},
    //     updated_at = now()
    //   WHERE id = ${id}
    // `;
  // } catch (error) {
  //   console.error({ message: 'Error al actualizar el producto.', error });
  //   return {
  //     message: 'Error de base de datos: No se pudo crear el producto.',
  //   };
  // }

  // revalidatePath(`/products`);
  // redirect('/products');
}

// DELETE: Borrado físico del producto
export async function deleteProduct(id: string, prevState: StateDeletingProduct) {
  const artesano_id_sesion = 'a239e0e7-70d2-47f9-83f7-d0a7e33e5850';

  try {
    const result = await sql`DELETE FROM products WHERE id = ${id} AND artesano_id = ${artesano_id_sesion} RETURNING id`;

    if (result.length === 0) {
      return { 
        message: 'No tienes permiso para eliminar este producto o ya no existe.',
        error: true 
      };
    }
    
    revalidatePath('/products');
  } catch (error) {
    console.error({ message: 'No se pudo eliminar el producto.', error });
    return { message: 'Database Error: Failed to Delete Product', error: true };
  }

  redirect('/products');
}