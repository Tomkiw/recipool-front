import Link from 'next/link';
import css from './ErrorState.module.css';

interface ErrorStateProps {
  title: string;
  text: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  backHref?: string;
  backLabel?: string;
}

export default function ErrorState({
  title,
  text,
  onRetry,
  isRetrying = false,
  backHref = '/',
  backLabel = 'Back to recipes',
}: ErrorStateProps) {
  return (
    <div className={css.root} role="alert">
      <span className={css.iconWrap} aria-hidden="true">
        <svg
          className={css.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5M12 16h.01" />
        </svg>
      </span>

      <h1 className={css.title}>{title}</h1>
      <p className={css.text}>{text}</p>

      <div className={css.actions}>
        {onRetry && (
          <button
            type="button"
            className={css.retry}
            onClick={onRetry}
            disabled={isRetrying}
          >
            <svg
              className={css.retryIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />
            </svg>
            {isRetrying ? 'Trying…' : 'Try again'}
          </button>
        )}
        <Link href={backHref} className={css.back}>
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
