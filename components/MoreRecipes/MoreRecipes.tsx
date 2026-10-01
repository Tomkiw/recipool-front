'use client';

import { useId } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import RecipeCard from '../RecipeCard/RecipeCard';
import RecipeCardSkeleton from '../RecipeCardSkeleton/RecipeCardSkeleton';
import { fetchRecipes } from '@/lib/api/clientApi';
import css from './MoreRecipes.module.css';

interface MoreRecipesProps {
  category: string;
  excludeId: string;
}

const MORE_RECIPES_COUNT = 4;

const SKELETON_KEYS = Array.from(
  { length: MORE_RECIPES_COUNT },
  (_, index) => `more-skeleton-${index}`
);

export default function MoreRecipes({ category, excludeId }: MoreRecipesProps) {
  const headingId = useId();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['recipes', 'more', category],
    // +1, бо поточний рецепт теж може потрапити у вибірку — його відфільтруємо.
    queryFn: () =>
      fetchRecipes({ category, perPage: MORE_RECIPES_COUNT + 1 }),
    enabled: Boolean(category),
  });

  const recipes = (data?.recipes ?? [])
    .filter((recipe) => recipe._id !== excludeId)
    .slice(0, MORE_RECIPES_COUNT);

  // Блок другорядний: при помилці чи без інших рецептів просто не показуємо його.
  if (isError || (!isLoading && recipes.length === 0)) return null;

  return (
    <section className={css.section} aria-labelledby={headingId}>
      <div className={css.header}>
        <h2 id={headingId} className={css.title}>
          More {category} recipes
        </h2>
        <Link href="/" className={css.allLink}>
          See all recipes
          <svg
            className={css.allIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      <ul className={css.grid}>
        {isLoading
          ? SKELETON_KEYS.map((key) => (
              <li key={key}>
                <RecipeCardSkeleton />
              </li>
            ))
          : recipes.map((recipe) => (
              <li key={recipe._id}>
                <RecipeCard recipe={recipe} />
              </li>
            ))}
      </ul>
    </section>
  );
}
