'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './DeleteRecipeModal.module.css';

interface DeleteRecipeModalProps {
  isOpen: boolean;
  recipeTitle: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteRecipeModal({
  isOpen,
  recipeTitle,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteRecipeModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, isDeleting, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isDeleting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className={css.overlay} onClick={handleBackdropClick}>
      <div className={css.modal}>
        <button
          onClick={onClose}
          className={css.closeButton}
          aria-label="Close"
          disabled={isDeleting}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.250001 0.25L7 7M7 7L0.25 13.75M7 7L13.75 13.75M7 7L13.75 0.250001"
              stroke="black"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h2 className={css.title}>Are you sure?</h2>
        <p className={css.description}>
          {`"${recipeTitle}" will be deleted permanently.`}
        </p>

        <div className={css.buttonGroup}>
          <button
            onClick={onClose}
            className={css.cancelButton}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={css.deleteButton}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
