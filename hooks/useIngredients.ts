import { useQuery } from '@tanstack/react-query';
import { getIngredientsFilter } from '@/lib/api/ingredientsApi';

export function useIngredients() {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: getIngredientsFilter,
    staleTime: Infinity,
  });
}
