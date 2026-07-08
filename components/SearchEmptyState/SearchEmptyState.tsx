'use client';

import css from './SearchEmptyState.module.css';

interface SearchEmptyStateProps {
  onReset?: () => void;
}

function SearchEmptyState({ onReset }: SearchEmptyStateProps) {
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  };
  return (
    <div className={css.badge}>
      <p className={css.badge__text}>
        We're sorry! We were not able to find a match.
      </p>
      <button className={css.badge__btn} onClick={handleReset}>
        Reset search and filters
      </button>
    </div>
  );
}

export default SearchEmptyState;
