'use client';

import { useState } from 'react';

import CategoryChips from '../CategoryChips/CategoryChips';
import SelectFilter from '../SelectFilter/SelectFilter';
import BottomSheet from '../BottomSheet/BottomSheet';
import { useCategories } from '@/hooks/useCategories';
import { useIngredients } from '@/hooks/useIngredients';
import { useRecipeFilters } from '@/hooks/useRecipeFilters';
import { useFiltersStore } from '@/lib/store/filtersStore';
import { pluralize } from '@/lib/utils/format';
import css from './Filters.module.css';

function Filters() {
  const { data: categories = [] } = useCategories();
  const { data: ingredients = [] } = useIngredients();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filters = useFiltersStore((state) => state.filters);
  const totalRecipes = useFiltersStore((state) => state.totalRecipes);
  const isLoading = useFiltersStore((state) => state.isLoading);
  const { applyFilters, resetFilters } = useRecipeFilters();

  const activeCount = [filters.category, filters.ingredient].filter(
    Boolean
  ).length;

  const handleCategoryChange = (category: string) => {
    void applyFilters({ category });
  };

  const handleIngredientChange = (ingredient: string) => {
    void applyFilters({ ingredient });
  };

  const handleReset = () => {
    void resetFilters();
  };

  const closeSheet = () => setIsSheetOpen(false);

  return (
    <div className={css.bar}>
      <div className={css.inner}>
        <CategoryChips
          categories={categories}
          value={filters.category}
          onChange={handleCategoryChange}
        />

        <span className={css.divider} aria-hidden="true" />

        <div className={css.ingredient}>
          <SelectFilter
            label="Ingredient"
            isLabelHidden
            options={ingredients}
            placeholder="Any ingredient"
            value={filters.ingredient}
            onChange={handleIngredientChange}
          />
        </div>

        <button
          type="button"
          className={css.sheetToggle}
          aria-haspopup="dialog"
          aria-expanded={isSheetOpen}
          onClick={() => setIsSheetOpen(true)}
        >
          <svg
            className={css.toggleIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" />
            <circle cx="15" cy="6" r="2" />
            <circle cx="9" cy="12" r="2" />
            <circle cx="17" cy="18" r="2" />
          </svg>
          Filters
          {activeCount > 0 && (
            <span className={css.badge}>
              {activeCount}
              <span className="visually-hidden"> active</span>
            </span>
          )}
        </button>
      </div>

      {isSheetOpen && (
        <BottomSheet
          title="Filters"
          onClose={closeSheet}
          footer={
            <>
              <button
                type="button"
                className={css.resetButton}
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                type="button"
                className={css.applyButton}
                onClick={closeSheet}
                disabled={isLoading}
              >
                {isLoading
                  ? 'Loading…'
                  : `Show ${pluralize(totalRecipes, 'recipe')}`}
              </button>
            </>
          }
        >
          <fieldset className={css.group}>
            <legend className={css.groupTitle}>Category</legend>
            <CategoryChips
              layout="wrap"
              categories={categories}
              value={filters.category}
              onChange={handleCategoryChange}
            />
          </fieldset>

          <SelectFilter
            label="Ingredient"
            options={ingredients}
            placeholder="Any ingredient"
            value={filters.ingredient}
            onChange={handleIngredientChange}
          />
        </BottomSheet>
      )}
    </div>
  );
}

export default Filters;
