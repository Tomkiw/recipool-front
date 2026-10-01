'use client';

import { ReactNode, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import css from './BottomSheet.module.css';

interface BottomSheetProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

// Рендериться лише коли відкрита (батько монтує її умовно), тож document
// уже існує. Портал потрібен, бо батьківська sticky-панель має свій z-index
// і інакше шторка опинилася б під хедером.
export default function BottomSheet({
  title,
  onClose,
  children,
  footer,
}: BottomSheetProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Тримаємо onClose у ref, щоб ефект нижче не перезапускався (і не
  // перекидав фокус) щоразу, коли батько передає нову функцію.
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, []);

  return createPortal(
    <div className={css.root}>
      <div className={css.backdrop} onClick={onClose} aria-hidden="true" />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={css.sheet}
      >
        <span className={css.handle} aria-hidden="true" />
        <header className={css.header}>
          <h2 id={titleId} className={css.title}>
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className={css.close}
            aria-label={`Close ${title.toLowerCase()}`}
            onClick={onClose}
          >
            <svg
              className={css.closeIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className={css.body}>{children}</div>
        {footer && <footer className={css.footer}>{footer}</footer>}
      </section>
    </div>,
    document.body
  );
}
