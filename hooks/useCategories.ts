import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/api/categoriesApi';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: Infinity,
  });
}
