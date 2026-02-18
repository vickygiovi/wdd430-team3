import { getUser, User } from "../lib/user-data";
import Image from "next/image";
import './profile.css';
import { auth } from '@/auth';

export default async function ProfilePage() {
  const session = await auth();

  // 2. Verificamos que el usuario esté logueado
  if (!session || !session.user || !session.user.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 font-bold">
          No autorizado. Debes iniciar sesión para realizar esta acción.
        </p>
      </div>
    );
  }
  const user: User = await getUser(session.user.email);

  return (
    <div className="profile-container">
      {/* Encabezado centrado */}
      <header className="profile-header">
        <h1 className="profile-name">{user.full_name}</h1>
        <h2 className="profile-username">@{user.username}</h2>
        <h2 className="profile-email">{user.email}</h2>
      </header>

      {/* Tarjeta de información: Imagen izquierda, Bio derecha */}
      <div className="profile-card">
        <div className="profile-avatar-wrapper">
          <Image 
            src={user.avatar_url as string} 
            alt={user.username} 
            width={200} 
            height={200}
            className="profile-avatar"
          />
        </div>
        
        <div className="profile-info">
          <h3 className="profile-role-badge">Rol: {user.role}</h3>
          <div className="profile-bio-content">
            <p>{user.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}