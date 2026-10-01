'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import {
  addToFavorites,
  deleteRecipe,
  removeFromFavorites,
} from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast';
import AuthModal from '../RecipeCardAuthModal/AuthModal';
import DeleteRecipeModal from '../DeleteRecipeModal/DeleteRecipeModal';
import type { Recipe } from '@/types/recipe';
import { formatCookingTime } from '@/lib/utils/format';
import css from './RecipeCard.module.css';

// Сітка: 1 колонка на мобільному, 2–3 на планшеті, 4 по 288px на 1440.
const CARD_IMAGE_SIZES =
  '(min-width: 1440px) 288px, (min-width: 768px) 50vw, 100vw';

interface RecipeCardProps {
  recipe: Recipe;
  variant?: 'default' | 'own' | 'favorite';
  onRemove?: (recipeId: string) => void;
}

export default function RecipeCard({
  recipe,
  variant = 'default',
  onRemove,
}: RecipeCardProps) {
  const { user, setUser, isAuthenticated } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const recipeId = recipe._id;

  const favorites = user?.favorites ?? [];

  const isFavorite = favorites.includes(recipeId);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        return removeFromFavorites(recipeId);
      }

      return addToFavorites(recipeId);
    },

    onSuccess: () => {
      if (!user) return;

      const updatedFavorites = isFavorite
        ? favorites.filter((id) => id !== recipeId)
        : [...favorites, recipeId];

      setUser({ ...user, favorites: updatedFavorites });

      if (variant === 'favorite') {
        onRemove?.(recipeId);
      }

      showSuccessToast(
        isFavorite
          ? 'Recipe removed from favorites'
          : 'Recipe added to favorites'
      );
    },

    onError: () => {
      showErrorToast('Failed to update favorites');
    },
  });

  const handleFavorite = () => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
      return;
    }

    mutation.mutate();
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteRecipe(recipeId),

    onSuccess: () => {
      // The backend also drops the recipe from every user's favorites,
      // so mirror that locally for the current user.
      if (user && favorites.includes(recipeId)) {
        setUser({
          ...user,
          favorites: favorites.filter((id) => id !== recipeId),
        });
      }

      setIsDeleteModalOpen(false);
      onRemove?.(recipeId);
      showSuccessToast('Recipe deleted');
    },

    onError: () => {
      showErrorToast('Failed to delete recipe');
    },
  });

  const shouldShowActive =
    variant === 'favorite' || (isAuthenticated && isFavorite);

  const imageSrc = recipe.thumb || recipe.image;
  const cookingTime = formatCookingTime(recipe.time);

  const [loadingLink, setLoadingLink] = useState(false);

  return (
    <>
      <article className={css.card}>
        <div className={css.media}>
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={recipe.title}
              fill
              sizes={CARD_IMAGE_SIZES}
              className={css.image}
            />
          )}

          <div className={css.badges}>
            {recipe.category && (
              <span className={css.badge}>{recipe.category}</span>
            )}
            {variant === 'own' && (
              <span className={`${css.badge} ${css.badgeOwn}`}>Yours</span>
            )}
          </div>

          {variant !== 'own' && (
            <button
              type="button"
              onClick={handleFavorite}
              disabled={mutation.isPending}
              className={`${css.iconButton} ${shouldShowActive ? css.iconButtonActive : ''}`}
              aria-pressed={shouldShowActive}
              aria-label={
                shouldShowActive
                  ? `Remove ${recipe.title} from favorites`
                  : `Save ${recipe.title}`
              }
            >
              {mutation.isPending ? (
                <span className={css.loader} />
              ) : (
                <svg className={css.icon} aria-hidden="true">
                  <use href="/icons/icons.svg#icon-save" />
                </svg>
              )}
            </button>
          )}
          {variant === 'own' && (
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={deleteMutation.isPending}
              className={`${css.iconButton} ${css.iconButtonDanger}`}
              aria-label={`Delete ${recipe.title}`}
            >
              {deleteMutation.isPending ? (
                <span className={css.loader} />
              ) : (
                <svg className={css.icon} aria-hidden="true">
                  <use href="/icons/icons.svg#icon-delete" />
                </svg>
              )}
            </button>
          )}
        </div>

        <div className={css.content}>
          <ul className={css.meta}>
            {cookingTime && (
              <li className={css.metaItem}>
                <svg className={css.metaIcon} aria-hidden="true">
                  <use href="/icons/icons.svg#icon-clock" />
                </svg>
                {cookingTime}
              </li>
            )}
            {recipe.area && <li className={css.metaItem}>{recipe.area}</li>}
            {recipe.calories > 0 && (
              <li className={css.metaItem}>~{recipe.calories} kcal</li>
            )}
          </ul>
          <h3 className={css.title}>{recipe.title}</h3>
          <p className={css.description}>{recipe.description}</p>
          {/* Stretched link: ::after розтягується на всю картку, тож клікабельна
              вся картка, а кнопка «Зберегти» лежить вище по z-index. */}
          <Link
            href={`/recipes/${recipeId}`}
            className={css.link}
            onClick={() => setLoadingLink(true)}
            aria-label={`View recipe: ${recipe.title}`}
          >
            {loadingLink ? (
              <span className={css.dots} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            ) : (
              <>
                View recipe
                <svg
                  className={css.linkIcon}
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
              </>
            )}
          </Link>
        </div>
      </article>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <DeleteRecipeModal
        isOpen={isDeleteModalOpen}
        recipeTitle={recipe.title}
        isDeleting={deleteMutation.isPending}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
      />
    </>
  );
}
