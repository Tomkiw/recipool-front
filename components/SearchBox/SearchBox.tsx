'use client';

import { useId, useState } from 'react';
import css from './SearchBox.module.css';
import Loader from '../Loader/Loader';
import { SEARCH_FORM_ID } from '@/lib/constants/recipes';

interface SearchBoxProps {
  onSearch: (value: string) => void;
  isLoading: boolean;
}
function SearchBox({ onSearch, isLoading }: SearchBoxProps) {
  const [error, setError] = useState<string>('');
  const inputId = useId();
  const errorId = useId();

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = (formData.get('query') as string) || '';

    if (!query.trim()) {
      setError('Please enter a recipe name to search!');
      return;
    }

    setError('');
    onSearch(query.trim());
  };
  return (
    <>
      <form
        id={SEARCH_FORM_ID}
        role="search"
        className={css.form}
        onSubmit={handleSubmit}
      >
        <div className={`${css.field} ${error ? css.fieldError : ''}`}>
          <svg
            className={css.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <label htmlFor={inputId} className="visually-hidden">
            Search recipes
          </label>
          <input
            id={inputId}
            className={css.input}
            name="query"
            type="search"
            placeholder="Search recipes, e.g. “curry”"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
          <button className={css.submit} type="submit" disabled={isLoading}>
            {isLoading ? <Loader variant="button" size="small" /> : 'Search'}
          </button>
        </div>
        {error && (
          <p id={errorId} className={css.error} role="alert">
            {error}
          </p>
        )}
      </form>
    </>
  );
}

export default SearchBox;
