'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  addToFavorites,
  removeFromFavorites,
  AddFavoriteResponse,
  RemoveFavoriteResponse,
} from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import AuthModal from '@/components/AuthModal/AuthModal';
import css from './SaveButton.module.css';

type Props = { recipeId: string };

const showToast = async (type: 'success' | 'error', message: string) => {
  const { default: iziToast } = await import('izitoast');
  await import('izitoast/dist/css/iziToast.min.css');
  iziToast[type]({ message, position: 'topRight' });
};

const SaveButton = ({ recipeId }: Props) => {
  const { user, setUser, isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const favorites = user?.favorites ?? [];
  const isSaved = favorites.includes(recipeId);

  const { mutate, isPending } = useMutation<
    AddFavoriteResponse | RemoveFavoriteResponse,
    Error,
    void
  >({
    mutationFn: () =>
      isSaved ? removeFromFavorites(recipeId) : addToFavorites(recipeId),
    onSuccess: () => {
      if (!user) return;
      const updatedFavorites = isSaved
        ? favorites.filter((id) => id !== recipeId)
        : [...favorites, recipeId];
      setUser({ ...user, favorites: updatedFavorites });
      showToast(
        'success',
        isSaved ? 'Removed from favourites' : 'Saved to favourites!'
      );
    },
    onError: () => {
      showToast('error', 'Something went wrong. Please try again.');
    },
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    mutate();
  };

  return (
    <>
      <button
        type="button"
        className={`${css.saveButton} ${isSaved ? css.saved : ''}`}
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={isSaved}
      >
        {isPending ? (
          <span className={css.spinner} />
        ) : (
          <>
            <svg
              className={isSaved ? css.saveIconFilled : css.saveIcon}
              aria-hidden="true"
            >
              <use href={'/icons/icons.svg#icon-save'} />
            </svg>
            <span>{isSaved ? 'Saved' : 'Save recipe'}</span>
          </>
        )}
      </button>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};

export default SaveButton;
