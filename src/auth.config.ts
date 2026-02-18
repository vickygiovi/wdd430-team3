// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', // Tu página de login personalizada
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role; // Asumiendo que agregaste 'role' a la sesión

      // 1. Definimos las rutas protegidas para Clientes y No Autenticados
      const protectedPaths = ['/mystories', '/products', '/profile'];
      
      const isPathProtected = protectedPaths.some((path) => 
        nextUrl.pathname.startsWith(path)
      );

      // LÓGICA DE PROTECCIÓN:
      
      // Si la ruta está protegida...
      if (isPathProtected) {
        // Si no ha iniciado sesión, bloquear (redirige a login)
        if (!isLoggedIn) return false;

        // Si es 'cliente', bloquear el acceso a estas rutas
        // (En tu lógica: Clientes NO pueden entrar a estas 3 rutas)
        if (userRole === 'cliente') return false;
        
        // Si es 'artesano', puede pasar a cualquier lado
        if (userRole === 'artesano') return true;
      }

      // Para cualquier otra ruta o si es artesano en ruta protegida, permitir
      return true;
    },
  },
  providers: [], // Los providers van en auth.ts para evitar problemas de Edge Runtime
} satisfies NextAuthConfig;