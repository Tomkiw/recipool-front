'use client';

import { useEffect, useRef, useState } from 'react';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast';
import css from './CopyLinkButton.module.css';

const COPIED_STATE_MS = 2000;

export default function CopyLinkButton() {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      void showSuccessToast('Link copied to clipboard');

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsCopied(false), COPIED_STATE_MS);
    } catch {
      // Clipboard API недоступний без HTTPS або якщо браузер заборонив доступ.
      void showErrorToast('Could not copy the link');
    }
  };

  return (
    <button type="button" className={css.button} onClick={handleCopy}>
      <svg
        className={css.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {isCopied ? (
          <path d="m5 12 5 5L20 7" />
        ) : (
          <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
        )}
      </svg>
      {isCopied ? 'Copied' : 'Copy link'}
    </button>
  );
}
