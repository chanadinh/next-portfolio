'use client'

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import EditorialShell, { PageIntro } from '../../components/portfolio/EditorialShell';
import styles from '../../components/portfolio/editorial.module.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        localStorage.removeItem('adminToken');
        setSuccess(true);
        window.location.replace('/admin');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <EditorialShell>
    <main id="page-content" className={`${styles.container} ${styles.login}`}>
      <PageIntro label="Private access / Portfolio studio" title="Behind the story.">
        A place to shape the next chapter. Manage project stories, update your profile, and keep your work current.
      </PageIntro>
      <section className={`${styles.paper} ${styles.loginPanel}`} aria-labelledby="login-heading">
        <p className={styles.eyebrow}>01 / Workspace access</p>
        <h2 id="login-heading">Welcome back, Chan.</h2>
        <form onSubmit={handleSubmit} className={styles.form} aria-busy={loading}>
          <div className={styles.field}>
            <label htmlFor="username">Username</label>
            <input id="username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <div className={styles.password}>
              <input id="password" name="password" autoComplete="current-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}</button>
            </div>
          </div>
          {error && <p role="alert" className={styles.error}>{error}</p>}
          {success && <p role="status" className={styles.success}>Signed in. Opening your workspace…</p>}
          <button type="submit" disabled={loading || success} className={styles.button}>{loading ? 'Signing in…' : success ? 'Opening workspace…' : 'Enter workspace ↗'}</button>
        </form>
        <p className={styles.help}>Private workspace for managing chandinh.dev.</p>
      </section>
    </main>
  </EditorialShell>;
}
