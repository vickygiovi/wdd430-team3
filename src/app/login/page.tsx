import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
import "./login.css";
 
export default function LoginPage() {
  return (
    <main className="login-page-container">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}