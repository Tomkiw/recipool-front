import { SearchFilters } from '@/types/filters';
import { useQuery } from '@tanstack/react-query';
import { fetchRecipes } from '@/lib/api/recipesApi';

export function useRecipes(filters: SearchFilters) {
  return useQuery({
    queryKey: ['recipes', filters],
    queryFn: () => fetchRecipes(filters),
    enabled:
      filters.keyword.trim() !== '' ||
      filters.category !== '' ||
      filters.ingredient !== '',
  });
}
