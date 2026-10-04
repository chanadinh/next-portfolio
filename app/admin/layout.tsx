import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE, verifyAdminToken } from '../../lib/admin-auth';
export const metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value)) redirect('/login');
  return <>{children}</>;
}
