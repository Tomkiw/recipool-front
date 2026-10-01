import { useFiltersStore } from '@/lib/store/filtersStore';
import { fetchRecipes, type FetchRecipesResponse } from '@/lib/api/clientApi';
import { showErrorToast } from '@/lib/utils/toast';
import { SEARCH_FORM_ID } from '@/lib/constants/recipes';
import type { SearchFilters } from '@/types/filters';

const EMPTY_FILTERS: SearchFilters = {
  keyword: '',
  category: '',
  ingredient: '',
};

// Лічильник на рівні модуля, бо стор глобальний і хук викликають кілька
// компонентів одночасно. Якщо користувач швидко клацає чипи, відповідь на
// старий запит може прийти пізніше за новий — такі відповіді ігноруємо.
let latestRequestId = 0;

// Інпут пошуку некерований (живе в SearchBox), тож скидаємо його через форму.
const clearSearchForm = () => {
  const form = document.getElementById(SEARCH_FORM_ID);
  if (form instanceof HTMLFormElement) form.reset();
};

export function useRecipeFilters() {
  const filtersChange = useFiltersStore((state) => state.filtersChange);
  const clearFilters = useFiltersStore((state) => state.clearFilters);
  const setRecipesData = useFiltersStore((state) => state.setRecipesData);
  const setIsLoading = useFiltersStore((state) => state.setIsLoading);
  const setPage = useFiltersStore((state) => state.setPage);

  const loadRecipes = async (
    filters: SearchFilters,
    page = 1
  ): Promise<FetchRecipesResponse | null> => {
    const requestId = ++latestRequestId;
    setIsLoading(true);

    try {
      const data = await fetchRecipes({ ...filters, page });
      if (requestId !== latestRequestId) return null;

      setRecipesData({
        recipes: data.recipes,
        totalRecipes: data.totalRecipes,
        totalPages: data.totalPages,
      });
      setPage(page);
      return data;
    } catch {
      if (requestId === latestRequestId) {
        void showErrorToast('Failed to load recipes. Please try again.');
      }
      return null;
    } finally {
      if (requestId === latestRequestId) setIsLoading(false);
    }
  };

  const applyFilters = (patch: Partial<SearchFilters>) => {
    // Беремо свіжий стан напряму зі стора, а не з замикання рендеру.
    const nextFilters = { ...useFiltersStore.getState().filters, ...patch };
    filtersChange(patch);
    if (patch.keyword === '') clearSearchForm();
    return loadRecipes(nextFilters);
  };

  const resetFilters = () => {
    clearFilters();
    clearSearchForm();
    return loadRecipes(EMPTY_FILTERS);
  };

  const changePage = (page: number) =>
    loadRecipes(useFiltersStore.getState().filters, page);

  return { applyFilters, resetFilters, changePage };
}
