'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import css from './AuthModal.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className={css.overlay} onClick={handleBackdropClick}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className={css.closeButton}
          aria-label="Close modal"
        >
          <svg className={css.closeIcon}>
            <use href="/icons/icons.svg#icon-close-modal" />
          </svg>
        </button>

        <h2 className={css.title}>Error while saving</h2>
        <p className={css.description}>
          To save this recipe, you need to authorize first
        </p>

        <div className={css.buttonGroup}>
          <Link
            href="/auth/login"
            className={css.loginButton}
            onClick={onClose}
          >
            Log in
          </Link>
          <Link
            href="/auth/register"
            className={css.registerButton}
            onClick={onClose}
          >
            Register
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
