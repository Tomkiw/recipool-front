import { useQuery } from '@tanstack/react-query';
import { getIngredients } from '@/lib/api/ingredientsApi';

export function useIngredients() {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: getIngredients,
    staleTime: Infinity,
  });
}
