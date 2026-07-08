'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { addToFavorites, removeFromFavorites } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast';
import AuthModal from '../RecipeCardAuthModal/AuthModal';
import type { Recipe } from '@/types/recipe';
import css from './RecipeCard.module.css';

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

  const shouldShowActive =
    variant === 'favorite' || (isAuthenticated && isFavorite);

  const imageSrc = recipe.thumb || recipe.image;

  const [loadingLink, setLoadingLink] = useState(false);

  return (
    <>
      <article className={css.card}>
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={recipe.title}
            width={337}
            height={230}
            className={css.image}
          />
        )}

        <div className={css.content}>
          <div className={css.header}>
            <h3 className={css.title}>{recipe.title}</h3>
            <div className={css.timeBox}>
              <svg width="14" height="14" className={css.timeIcon}>
                <use href="/icons/icons.svg#icon-clock" />
              </svg>
              <span>{recipe.time ? `${recipe.time}` : '—'}</span>
            </div>
          </div>
          <div className={css.descriptionBox}>
            <p className={css.description}>{recipe.description}</p>
            <span className={css.calories}>
              {recipe.calories ? `~${recipe.calories} cals` : '—'}
            </span>
          </div>
          <div className={css.actions}>
            <Link
              href={`/recipes/${recipeId}`}
              className={css.learnMore}
              onClick={() => setLoadingLink(true)}
            >
              {loadingLink ? (
                <div className={css.dots}>
                  <span />
                  <span />
                  <span />
                </div>
              ) : (
                'Learn More'
              )}
            </Link>
            {variant !== 'own' && (
              <button
                type="button"
                onClick={handleFavorite}
                disabled={mutation.isPending}
                className={`
                  ${css.favorite}
                  ${shouldShowActive ? css.favoriteActive : ''}
                `}
              >
                {mutation.isPending ? (
                  <span className={css.loader} />
                ) : (
                  <svg width="24" height="24" className={css.saveIcon}>
                    <use href={'/icons/icons.svg#icon-save'} />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </article>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
