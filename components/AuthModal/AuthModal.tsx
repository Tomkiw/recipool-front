'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import css from './AuthModal.module.css';

type Props = {
  onClose: () => void;
};

const AuthModal = ({ onClose }: Props) => {
  // Закриття по Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Блокуємо scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return createPortal(
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button className={css.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h2 className={css.title}>Sign in to save recipes</h2>
        <p className={css.subtitle}>
          Create an account or log in to start saving your favourite recipes.
        </p>
        <div className={css.actions}>
          <Link href="/auth/login" className={css.btnPrimary} onClick={onClose}>
            Log in
          </Link>
          <Link
            href="/auth/register"
            className={css.btnSecondary}
            onClick={onClose}
          >
            Register
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;
