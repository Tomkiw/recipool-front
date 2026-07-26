'use client';
import { showErrorToast } from '@/lib/utils/toast';
import { useState } from 'react';

import SelectFilter from '../SelectFilter/SelectFilter';
import { useCategories } from '@/hooks/useCategories';
import { useIngredients } from '@/hooks/useIngredients';
import { fetchRecipes } from '@/lib/api/clientApi';
import { useFiltersStore } from '@/lib/store/filtersStore';
import { SearchFilters } from '@/types/filters';
import css from './Filters.module.css';

function Filters() {
  const { data: categories = [] } = useCategories();
  const { data: ingredients = [] } = useIngredients();

  const [isOpen, setIsOpen] = useState(false);

  const filters = useFiltersStore((state) => state.filters);
  const filtersChange = useFiltersStore((state) => state.filtersChange);
  const clearFilters = useFiltersStore((state) => state.clearFilters);
  const setRecipesData = useFiltersStore((state) => state.setRecipesData);
  const setIsLoading = useFiltersStore((state) => state.setIsLoading);
  const totalRecipes = useFiltersStore((state) => state.totalRecipes);

  const updateFilters = async (newFilters: SearchFilters) => {
    setIsLoading(true);
    try {
      const query = {
        keyword: newFilters.keyword,
        category: newFilters.category,
        ingredient: newFilters.ingredient,
      };
      const data = await fetchRecipes(query);

      // console.log('--- РЕЗУЛЬТАТ ЗАПИТУ З ФІЛЬТРАМИ ---', {
      //   'parametrs sent': query,
      //   'sorted recipes': data,
      //   'recipes store': 'useFiltersStore((state) => state.recipes)',
      //   'recipes amount': 'useFiltersStore((state) => state.totalRecipes)',
      // });

      setRecipesData({
        recipes: data.recipes,
        totalRecipes: data.totalRecipes,
        totalPages: data.totalPages,
      });
    } catch {
      await showErrorToast('Failed to fetch filtered recipes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    const moreFilters = { ...filters, category: value };
    filtersChange({ category: value });
    updateFilters(moreFilters);
  };

  const handleIngredientChange = (value: string) => {
    const moreFilters = { ...filters, ingredient: value };
    filtersChange({ ingredient: value });
    updateFilters(moreFilters);
  };

  const handleReset = () => {
    clearFilters();
    updateFilters({ keyword: '', category: '', ingredient: '' });

    const searchForm = document.getElementById(
      'search__recipes__form'
    ) as HTMLFormElement;
    if (searchForm) {
      searchForm.reset();
    }
  };

  return (
    <>
      <div className={css.filters__container}>
        <span className={css.filters__count}>{totalRecipes} recipes</span>

        <button
          className={css.filter__toggle__btn}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open filters"
        >
          Filters
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </button>

        <div className={`${css.filters__block} ${isOpen ? css.isOpen : ''}`}>
          <div className={css.mobile__close}>
            <span className={css.mobile__title}>Filters</span>
            <button
              className={css.mobile__close__btn}
              onClick={() => setIsOpen(false)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.125 12C19.125 15.935 15.935 19.125 12 19.125C8.06497 19.125 4.875 15.935 4.875 12C4.875 8.06497 8.06497 4.875 12 4.875C15.935 4.875 19.125 8.06497 19.125 12Z"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <path
                  d="M14.7745 9.25965L12 12.0341M12 12.0341L9.22559 14.8086M12 12.0341L14.7745 14.8086M12 12.0341L9.22559 9.25964"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className={css.select__block}>
            <SelectFilter
              options={categories}
              placeholder="Category"
              value={filters.category}
              onChange={handleCategoryChange}
            />
            <SelectFilter
              options={ingredients}
              placeholder="Ingredient"
              value={filters.ingredient}
              onChange={handleIngredientChange}
            />
          </div>
          <button className={css.reset__btn} onClick={handleReset}>
            Reset filters
          </button>
        </div>
      </div>
    </>
  );
}

export default Filters;
