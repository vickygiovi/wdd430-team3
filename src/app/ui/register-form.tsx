'use client';

import { useActionState, useState, ChangeEvent } from 'react';
import { registerUser } from '@/app/lib/user-actions';
import styles from './login.module.css';

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, { message: null, errors: {} });
  
  // Estado para la vista previa de la imagen
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Función para manejar el cambio del archivo y generar la preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Creamos una URL local para que el navegador pueda mostrar la imagen
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ maxWidth: '500px' }}>
        <form action={formAction}>
          <div className={styles.header}>
            <h1>Crear Cuenta</h1>
            <p>Únete a nuestra comunidad de artesanos</p>
          </div>

          <div className={styles.formBody}>
            {/* Username y Email */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Username *</label>
              <input name="username" className={styles.input} required placeholder="ej: artisan_joyas" />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email *</label>
              <input name="email" type="email" className={styles.input} required placeholder="correo@ejemplo.com" />
            </div>

            {/* Password */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Password *</label>
              <input name="password" type="password" className={styles.input} required minLength={6} />
            </div>

            <hr style={{ margin: '1.5rem 0', border: '0', borderTop: '1px solid #eee' }} />
            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>Información de Perfil (Opcional)</p>

            {/* SECCIÓN DE AVATAR CON PREVIEW */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Foto de Perfil</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                {/* Contenedor de la Preview */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #e5e7eb',
                  flexShrink: 0
                }}>
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <span style={{ fontSize: '2rem', color: '#9ca3af' }}>👤</span>
                  )}
                </div>
                
                {/* Input de archivo real */}
                <input 
                  type="file" 
                  name="avatar_file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.input}
                  style={{ fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Nombre Completo</label>
              <input name="full_name" className={styles.input} placeholder="Tu nombre real" />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Biografía</label>
              <textarea name="bio" className={styles.input} rows={3} placeholder="Cuéntanos sobre tu trabajo..." style={{ resize: 'none' }} />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Rol</label>
              <select name="role" className={styles.input}>
                <option value="artesano">Artesano</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>

            <button type="submit" disabled={isPending} className={styles.loginButton}>
              {isPending ? 'Creando cuenta...' : 'Registrarse'}
            </button>

            {state.message && (
              <div className={styles.errorBox}>
                <span>⚠</span>
                <p>{state.message}</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}