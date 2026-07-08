import { redirect } from 'next/navigation';
import { getServerMe } from '@/lib/api/serverApi';

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await getServerMe();
  } catch {
    redirect('/auth/login');
  }

  return <>{children}</>;
}
