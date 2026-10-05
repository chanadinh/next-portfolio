'use client';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import styles from './portfolio.module.css';

export default function ContactForm() {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setPending(true); setStatus(null);
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(values)) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Your message could not be sent. Please try email instead.');
      setStatus({ success: true, message: 'Message received. Thanks for getting in touch.' }); form.reset();
    } catch (error) { setStatus({ success: false, message: error instanceof Error ? error.message : 'Your message could not be sent. Please try email instead.' }); }
    finally { setPending(false); }
  }
  return <form className={styles.contactForm} onSubmit={submit} data-reveal="right">
    <fieldset disabled={pending}><legend className={styles.srOnly}>Send Chan a message</legend>
      <div className={styles.formRow}><label>Name<input name="name" autoComplete="name" required maxLength={120} /></label><label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label></div>
      <label>What’s on your mind?<input name="subject" required maxLength={200} placeholder="A role, a project, a race…" /></label>
      <label>Your message<textarea name="message" required rows={4} maxLength={5000} /></label>
      <button className={styles.solidButton} type="submit">{pending ? 'Sending…' : 'Send message'}<ArrowUpRight size={17} aria-hidden="true" /></button>
    </fieldset>
    {status && <p className={status.success ? styles.success : styles.error} role={status.success ? 'status' : 'alert'}>{status.message}</p>}
  </form>;
}
