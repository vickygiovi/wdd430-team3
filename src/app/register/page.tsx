// app/register/page.tsx
import RegisterForm from '@/app/ui/register-form'; // Ajusta la ruta según tu carpeta ui
import { Suspense } from 'react';

export default function RegisterPage() {
  return (
    <main>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando formulario...</div>}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}