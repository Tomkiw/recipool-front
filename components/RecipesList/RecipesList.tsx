'use client';

import css from './RecipesList.module.css';
import { useEffect, useState } from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
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

  const keyword = useFiltersStore((state) => state.filters.keyword) ?? '';
  const filters = useFiltersStore((state) => state.filters);
  const hasActiveFilters = Boolean(
    filters?.keyword || filters?.category || filters?.ingredient
  );

  const page = useFiltersStore((state) => state.page);
  const setPage = useFiltersStore((state) => state.setPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setRecipesData({
      recipes: initialRecipes,
      totalRecipes,
      totalPages: initialTotalPages,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasMore = page < totalPages;

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      // Довантажуємо з урахуванням активних фільтрів зі стора
      // (keyword/category/ingredient), а не порожніх пропсів сторінки.
      const data = await fetchRecipes(
        nextPage,
        filters.keyword || searchQuery,
        filters.category || currentCategory,
        filters.ingredient
      );

      setRecipesData({
        recipes: [...recipes, ...data.recipes],
        totalRecipes: data.totalRecipes,
        totalPages: data.totalPages,
      });

      setPage(nextPage);
    } catch (error) {
      const iziToast = (await import('izitoast')).default;
      iziToast.error({
        title: 'Error',
        message: 'Failed to load more recipes. Please try again later.',
        position: 'topRight',
        timeout: 2000,
      });
    } finally {
      setIsLoadingMore(false);
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

      {hasMore && !isLoading && (
        <div className={css.loadMoreWrapper}>
          <LoadMoreBtn onClick={handleLoadMore} disabled={isLoadingMore} />
        </div>
      )}
    </div>
  );
}
