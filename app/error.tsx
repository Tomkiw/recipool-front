'use client';

import { useEffect } from 'react';
import css from './error.module.css';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={css.container}>
      <h1 className={css.title}>Something went wrong</h1>
      <p className={css.message}>
        An unexpected error occurred while loading this page. Please try again.
      </p>
      <button type="button" className={css.button} onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
