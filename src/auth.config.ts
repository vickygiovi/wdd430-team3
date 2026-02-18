// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;

      // 1. Definimos las rutas que requieren sesión obligatoria
      const isDetailsPage = nextUrl.pathname.startsWith('/catalog/'); // Solo protege si hay algo después de /catalog/
      const isManagementPath = ['/mystories', '/products', '/profile'].some((path) => 
        nextUrl.pathname.startsWith(path)
      );

      // LÓGICA DE PROTECCIÓN:

      // CASO A: Intentando entrar a los detalles del producto (/catalog/[id])
      if (isDetailsPage) {
        if (!isLoggedIn) return false; // Si no hay sesión, al login
        return true; // Si está logueado (sea cliente o artesano), puede ver detalles
      }

      // CASO B: Intentando entrar a gestión (Historias, Productos, Perfil)
      if (isManagementPath) {
        if (!isLoggedIn) return false;
        
        // Solo artesanos entran aquí
        if (userRole === 'artesano') return true;
        
        // Si es cliente, bloqueamos el acceso
        return false; 
      }

      // El catálogo general (/catalog) y lo demás es público
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;