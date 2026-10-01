'use client';

import { useEffect, useId } from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';
import RecipeCardSkeleton from '../RecipeCardSkeleton/RecipeCardSkeleton';
import Pagination from '../Pagination/Pagination';
import Filters from '../Filters/Filters';
import ActiveFilters from '../ActiveFilters/ActiveFilters';
import SearchEmptyState from '../SearchEmptyState/SearchEmptyState';
import { useFiltersStore } from '@/lib/store/filtersStore';
import { useRecipeFilters } from '@/hooks/useRecipeFilters';
import {
  POPULAR_CATEGORIES,
  RECIPES_PER_PAGE,
  RECIPES_SECTION_ID,
} from '@/lib/constants/recipes';
import { pluralize } from '@/lib/utils/format';
import type { Recipe } from '@/types/recipe';
import type { SearchFilters } from '@/types/filters';
import css from './RecipesList.module.css';

interface RecipeListProps {
  initialRecipes: Recipe[];
  totalPages: number;
  totalRecipes: number;
}

// Скелетонів стільки ж, скільки карток на сторінці, — висота сітки не змінюється.
const SKELETON_KEYS = Array.from(
  { length: RECIPES_PER_PAGE },
  (_, index) => `skeleton-${index}`
);

const getHeading = ({ keyword, category }: SearchFilters) => {
  if (keyword) return `Results for “${keyword}”`;
  if (category) return `${category} recipes`;
  return 'Recipes';
};

const scrollToList = () => {
  document
    .getElementById(RECIPES_SECTION_ID)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function RecipeList({
  initialRecipes,
  totalPages: initialTotalPages,
  totalRecipes: initialTotalRecipes,
}: RecipeListProps) {
  const headingId = useId();

  const recipes = useFiltersStore((state) => state.recipes);
  const totalPages = useFiltersStore((state) => state.totalPages);
  const totalRecipes = useFiltersStore((state) => state.totalRecipes);
  const isLoading = useFiltersStore((state) => state.isLoading);
  const filters = useFiltersStore((state) => state.filters);
  const page = useFiltersStore((state) => state.page);
  const setRecipesData = useFiltersStore((state) => state.setRecipesData);
  const setPage = useFiltersStore((state) => state.setPage);
  const clearFilters = useFiltersStore((state) => state.clearFilters);

  const { applyFilters, resetFilters, changePage } = useRecipeFilters();

  const hasActiveFilters = Boolean(
    filters.keyword || filters.category || filters.ingredient
  );

  useEffect(() => {
    // Стор глобальний: після повернення на головну в ньому могли лишитися
    // фільтри й сторінка з попереднього візиту, а список уже серверний —
    // скидаємо все, щоб пілюлі фільтрів відповідали карткам.
    clearFilters();
    setRecipesData({
      recipes: initialRecipes,
      totalRecipes: initialTotalRecipes,
      totalPages: initialTotalPages,
    });
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // До гідратації стора (і в SSR) стор порожній — показуємо серверні дані,
  // щоб не було спалаху «No recipes yet» і HTML одразу містив картки.
  const isShowingInitial =
    recipes.length === 0 && !hasActiveFilters && !isLoading;
  const displayRecipes = isShowingInitial ? initialRecipes : recipes;
  const displayTotal = isShowingInitial ? initialTotalRecipes : totalRecipes;
  const displayTotalPages = isShowingInitial ? initialTotalPages : totalPages;

  const firstShown = (page - 1) * RECIPES_PER_PAGE + 1;
  const lastShown = Math.min(page * RECIPES_PER_PAGE, displayTotal);
  const showPagination = displayTotalPages > 1 && !isLoading;

  const handlePageChange = async (nextPage: number) => {
    if (isLoading || nextPage === page) return;
    await changePage(nextPage);
    scrollToList();
  };

  const handlePickSuggestion = (category: string) => {
    void applyFilters({ keyword: '', ingredient: '', category });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <p className="visually-hidden" role="status">
            Loading recipes…
          </p>
          <ul className={css.grid} aria-hidden="true">
            {SKELETON_KEYS.map((key) => (
              <li key={key} className={css.gridItem}>
                <RecipeCardSkeleton />
              </li>
            ))}
          </ul>
        </>
      );
    }

    if (displayRecipes.length === 0) {
      return hasActiveFilters ? (
        <SearchEmptyState
          query={filters.keyword}
          suggestions={POPULAR_CATEGORIES}
          onReset={() => void resetFilters()}
          onPickSuggestion={handlePickSuggestion}
        />
      ) : (
        <p className={css.emptyText}>No recipes yet.</p>
      );
    }

    return (
      <ul className={css.grid}>
        {displayRecipes.map((recipe) => (
          <li key={recipe._id} className={css.gridItem}>
            <RecipeCard recipe={recipe} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section
      id={RECIPES_SECTION_ID}
      className={css.section}
      aria-labelledby={headingId}
    >
      <Filters />

      <div className={css.container}>
        <div className={css.header}>
          <div className={css.headingGroup}>
            <h2 id={headingId} className={css.title}>
              {getHeading(filters)}
            </h2>
            <p className={css.count}>
              {isLoading ? 'Loading…' : pluralize(displayTotal, 'recipe')}
            </p>
          </div>
          <ActiveFilters />
        </div>

        {renderContent()}

        {showPagination && (
          <div className={css.paginationRow}>
            <p className={css.showing}>
              Showing {firstShown}–{lastShown} of {displayTotal}
            </p>
            <Pagination
              totalPages={displayTotalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </section>
  );
}
