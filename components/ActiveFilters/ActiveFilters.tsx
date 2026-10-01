'use client';

import { useFiltersStore } from '@/lib/store/filtersStore';
import { useRecipeFilters } from '@/hooks/useRecipeFilters';
import type { SearchFilters } from '@/types/filters';
import css from './ActiveFilters.module.css';

type FilterKey = keyof SearchFilters;

const FILTER_ORDER: FilterKey[] = ['keyword', 'category', 'ingredient'];

const FILTER_NAMES: Record<FilterKey, string> = {
  keyword: 'search',
  category: 'category',
  ingredient: 'ingredient',
};

export default function ActiveFilters() {
  const filters = useFiltersStore((state) => state.filters);
  const { applyFilters, resetFilters } = useRecipeFilters();

  const activeKeys = FILTER_ORDER.filter((key) => filters[key]);
  if (activeKeys.length === 0) return null;

  const handleRemove = (key: FilterKey) => {
    const patch: Partial<SearchFilters> = {};
    patch[key] = '';
    void applyFilters(patch);
  };

  return (
    <div className={css.root}>
      <ul className={css.list} aria-label="Active filters">
        {activeKeys.map((key) => (
          <li key={key} className={css.pill}>
            {key === 'keyword' ? `“${filters[key]}”` : filters[key]}
            <button
              type="button"
              className={css.remove}
              aria-label={`Remove ${FILTER_NAMES[key]} filter`}
              onClick={() => handleRemove(key)}
            >
              <svg
                className={css.removeIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={css.reset}
        onClick={() => void resetFilters()}
      >
        Reset filters
      </button>
    </div>
  );
}
