'use client';

import css from './SearchEmptyState.module.css';

interface SearchEmptyStateProps {
  query?: string;
  suggestions?: readonly string[];
  onReset: () => void;
  onPickSuggestion?: (suggestion: string) => void;
}

function SearchEmptyState({
  query,
  suggestions = [],
  onReset,
  onPickSuggestion,
}: SearchEmptyStateProps) {
  const title = query
    ? `No recipes match “${query}”`
    : 'No recipes match these filters';
  const hasSuggestions = suggestions.length > 0 && Boolean(onPickSuggestion);

  return (
    <div className={css.root} role="status">
      <span className={css.iconWrap} aria-hidden="true">
        <svg
          className={css.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 11h18a9 9 0 0 1-18 0z" />
          <path d="M8 7c0-1 1-1.5 1-2.5M12 7c0-1 1-1.5 1-2.5M16 7c0-1 1-1.5 1-2.5" />
        </svg>
      </span>

      <h3 className={css.title}>{title}</h3>
      <p className={css.text}>
        Check the spelling or try fewer filters.
        {hasSuggestions && ' Or browse a category:'}
      </p>

      {hasSuggestions && (
        <ul className={css.suggestions}>
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                className={css.chip}
                onClick={() => onPickSuggestion?.(suggestion)}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className={css.reset} onClick={onReset}>
        Reset filters
      </button>
    </div>
  );
}

export default SearchEmptyState;
