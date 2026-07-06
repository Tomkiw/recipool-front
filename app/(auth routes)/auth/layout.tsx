'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useEffect, useState } from 'react';
import Loader from '@/components/Loader/Loader';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    router.refresh();
    startTransition(() => {
      setLoading(false);
    });
  }, [router]);

  return <>{loading ? <Loader variant="section" size="large" /> : children}</>;
}
