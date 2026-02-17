import { getUser, User } from "../lib/user-data";
import Image from "next/image";
import './profile.css';

export default async function ProfilePage() {
  const user: User = await getUser('cliente@ejemplo.com');

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