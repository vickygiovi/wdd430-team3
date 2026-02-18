'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import styles from './login.module.css'; // Importación del CSS

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <form action={formAction}>
          {/* Header */}
          <div className={styles.header}>
            <h1>Welcome Back</h1>
            <p>Please log in to your account</p>
          </div>

          <div className={styles.formBody}>
            {/* Email */}
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="email">Email Address</label>
              <input
                className={styles.input}
                id="email"
                type="email"
                name="email"
                placeholder="name@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="password">Password</label>
                <a href="#" className={styles.link} style={{fontSize: '0.75rem'}}>Forgot?</a>
              </div>
              <input
                className={styles.input}
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <input type="hidden" name="redirectTo" value={callbackUrl} />

            {/* Botón de Login */}
            <button
              type="submit"
              disabled={isPending}
              className={styles.loginButton}
            >
              {isPending ? 'Processing...' : 'Log In'}
            </button>

            {/* Error */}
            {errorMessage && (
              <div className={styles.errorBox}>
                <span>⚠</span>
                <p>{errorMessage}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <p>
              Don&apos;t have an account? <a href="#" className={styles.link}>Sign up</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}