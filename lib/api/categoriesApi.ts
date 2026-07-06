import { Category } from '@/types/category';

export async function getCategories(): Promise<Category[]> {
  // Server component: потрібен абсолютний URL напряму на бекенд
  // Client component: відносний URL через Next.js proxy
  const url =
    typeof window === 'undefined'
      ? `${process.env.NEXT_BACKEND_API_URL}/api/categories`
      : '/api/categories';

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}
