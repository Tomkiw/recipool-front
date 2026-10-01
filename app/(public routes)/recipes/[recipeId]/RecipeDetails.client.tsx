'use client';

import { useId } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchRecipeById } from '@/lib/api/clientApi';
import { formatCookingTime, splitInstructions } from '@/lib/utils/format';
import SaveButton from '@/components/SaveButton/SaveButton';
import CopyLinkButton from '@/components/CopyLinkButton/CopyLinkButton';
import Loader from '@/components/Loader/Loader';
import ErrorState from '@/components/ErrorState/ErrorState';
import IngredientsChecklist from '@/components/IngredientsChecklist/IngredientsChecklist';
import MoreRecipes from '@/components/MoreRecipes/MoreRecipes';
import css from './RecipeDetails.module.css';

const HERO_IMAGE_SIZES = '(min-width: 1440px) 580px, (min-width: 768px) 50vw, 100vw';
const FALLBACK_IMAGE = '/not-found.jpg';

const RecipeDetailsClient = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const stepsHeadingId = useId();

  const {
    data: recipe,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => fetchRecipeById(recipeId),
    refetchOnMount: false,
  });

  if (isLoading) return <Loader variant="section" size="large" />;

  if (error || !recipe) {
    return (
      <div className={css.container}>
        <ErrorState
          title="We couldn’t load this recipe"
          text="Something went wrong on our side. Check your connection and try again."
          onRetry={() => void refetch()}
          isRetrying={isRefetching}
        />
      </div>
    );
  }

  const cookingTime = formatCookingTime(recipe.time);
  const steps = splitInstructions(recipe.instructions);

  return (
    <article className={css.container}>
      <nav aria-label="Breadcrumb" className={css.breadcrumb}>
        <ol className={css.breadcrumbList}>
          <li className={css.breadcrumbItem}>
            <Link href="/" className={css.breadcrumbLink}>
              Recipes
            </Link>
          </li>
          {recipe.category && (
            <li className={css.breadcrumbItem}>{recipe.category}</li>
          )}
          <li className={css.breadcrumbItem} aria-current="page">
            {recipe.title}
          </li>
        </ol>
      </nav>

      <header className={css.hero}>
        <div className={css.imageWrapper}>
          <Image
            src={recipe.thumb || recipe.image || FALLBACK_IMAGE}
            alt={recipe.title}
            fill
            priority
            sizes={HERO_IMAGE_SIZES}
            className={css.image}
          />
        </div>

        <div className={css.intro}>
          <ul className={css.tags}>
            {recipe.category && (
              <li className={`${css.tag} ${css.tagAccent}`}>
                {recipe.category}
              </li>
            )}
            {recipe.area && <li className={css.tag}>{recipe.area}</li>}
          </ul>

          <h1 className={css.title}>{recipe.title}</h1>
          <p className={css.description}>{recipe.description}</p>

          <ul className={css.stats}>
            {cookingTime && (
              <li className={css.stat}>
                <svg className={css.statIcon} aria-hidden="true">
                  <use href="/icons/icons.svg#icon-clock" />
                </svg>
                <span className={css.statValue}>{cookingTime}</span>
                <span className={css.statLabel}>Cooking time</span>
              </li>
            )}
            {recipe.area && (
              <li className={css.stat}>
                <svg
                  className={css.statIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
                </svg>
                <span className={css.statValue}>{recipe.area}</span>
                <span className={css.statLabel}>Cuisine</span>
              </li>
            )}
            <li className={css.stat}>
              <svg
                className={css.statIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
              </svg>
              <span className={css.statValue}>{recipe.ingredients.length}</span>
              <span className={css.statLabel}>Ingredients</span>
            </li>
            {recipe.calories > 0 && (
              <li className={css.stat}>
                <svg
                  className={css.statIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 1.5 1 2.5 2 2.5 0-3-1-5 1-8z" />
                </svg>
                <span className={css.statValue}>~{recipe.calories} kcal</span>
                <span className={css.statLabel}>Per serving</span>
              </li>
            )}
          </ul>

          <div className={css.actions}>
            <SaveButton recipeId={recipeId} />
            <CopyLinkButton />
          </div>
        </div>
      </header>

      <div className={css.body}>
        {/* Інгредієнти першими в DOM: на мобільному їх збирають до кроків,
            а на десктопі сітка переносить їх у праву колонку. */}
        <div className={css.sidebar}>
          <IngredientsChecklist ingredients={recipe.ingredients} />
        </div>

        <section className={css.steps} aria-labelledby={stepsHeadingId}>
          <div className={css.sectionHeader}>
            <h2 id={stepsHeadingId} className={css.sectionTitle}>
              Preparation
            </h2>
            {steps.length > 1 && (
              <span className={css.sectionMeta}>{steps.length} steps</span>
            )}
          </div>

          <ol className={css.stepList}>
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              return (
                // Кроки статичні й ніколи не переставляються, тож номер —
                // стабільний ключ; текст додаємо на випадок однакових кроків.
                <li key={`${stepNumber}-${step}`} className={css.step}>
                  <span className={css.stepNumber} aria-hidden="true">
                    {stepNumber}
                  </span>
                  <div className={css.stepBody}>
                    <span className={css.stepLabel}>Step {stepNumber}</span>
                    <p className={css.stepText}>{step}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <MoreRecipes category={recipe.category} excludeId={recipe._id} />
    </article>
  );
};

export default RecipeDetailsClient;
