'use client';

import css from './RecipesList.module.css';
import { useEffect } from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';
import Pagination from '../Pagination/Pagination';
import { fetchRecipes } from '@/lib/api/clientApi';
import { Recipe } from '@/types/recipe';
import Filters from '../Filters/Filters';
import { useFiltersStore } from '@/lib/store/filtersStore';
import Loader from '../Loader/Loader';
import SearchEmptyState from '../SearchEmptyState/SearchEmptyState';

interface RecipeListProps {
  initialRecipes: Recipe[];
  totalPages: number;
  totalRecipes: number;
  searchQuery?: string;
  currentCategory?: string;
}

export default function RecipeList({
  initialRecipes,
  totalPages: initialTotalPages,
  totalRecipes,
  searchQuery = '',
  currentCategory = '',
}: RecipeListProps) {
  const recipes = useFiltersStore((state) => state.recipes);
  const totalPages = useFiltersStore((state) => state.totalPages);
  const isLoading = useFiltersStore((state) => state.isLoading);
  const setRecipesData = useFiltersStore((state) => state.setRecipesData);
  const setIsLoading = useFiltersStore((state) => state.setIsLoading);

  const keyword = useFiltersStore((state) => state.filters.keyword) ?? '';
  const filters = useFiltersStore((state) => state.filters);
  const hasActiveFilters = Boolean(
    filters?.keyword || filters?.category || filters?.ingredient
  );

  const page = useFiltersStore((state) => state.page);
  const setPage = useFiltersStore((state) => state.setPage);

  useEffect(() => {
    setRecipesData({
      recipes: initialRecipes,
      totalRecipes,
      totalPages: initialTotalPages,
    });
    // Скидаємо сторінку, бо стор глобальний і міг зберегти значення
    // з попереднього маршруту (наприклад, якщо там гортали пагінацію).
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showPagination = totalPages > 1;

  const handlePageChange = async (nextPage: number) => {
    if (isLoading || nextPage === page) return;

    setIsLoading(true);
    try {
      // Переходимо на обрану сторінку з урахуванням активних фільтрів зі
      // стора (keyword/category/ingredient), а не порожніх пропсів сторінки.
      const data = await fetchRecipes({
        page: nextPage,
        keyword: filters.keyword || searchQuery,
        category: filters.category || currentCategory,
        ingredient: filters.ingredient,
      });

      setRecipesData({
        recipes: data.recipes,
        totalRecipes: data.totalRecipes,
        totalPages: data.totalPages,
      });

      setPage(nextPage);
    } catch {
      const iziToast = (await import('izitoast')).default;
      iziToast.error({
        title: 'Error',
        message: 'Failed to load recipes. Please try again later.',
        position: 'topRight',
        timeout: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h1 className={css.title}>
          {keyword ? `Search Results for "${keyword}"` : 'Recipes'}
        </h1>
        <div className={css.meta}>
          <Filters />
        </div>
      </div>

      {isLoading ? (
        <Loader text="Loading recipes..." variant="section" size="large" />
      ) : recipes.length === 0 && hasActiveFilters ? (
        <SearchEmptyState />
      ) : (
        <ul className={css.grid}>
          {recipes.map((recipe) => (
            <li key={recipe._id} className={css.gridItem}>
              <RecipeCard recipe={recipe} />
            </li>
          ))}
        </ul>
      )}

      {showPagination && !isLoading && (
        <div className={css.paginationWrapper}>
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
