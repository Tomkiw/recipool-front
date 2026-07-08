'use client';

import { useState } from 'react';
import css from './SearchBox.module.css';
import Loader from '../Loader/Loader';
import style from '@/app/Home.module.css';

interface SearchBoxProps {
  onSearch: (value: string) => void;
  isLoading: boolean;
}
function SearchBox({ onSearch, isLoading }: SearchBoxProps) {
  const [error, setError] = useState<string>('');

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
        id="search__recipes__form"
        className={css.form}
        onSubmit={handleSubmit}
      >
        <div className={css.searchWrapper}>
          <input
            className={`${css.input} ${error ? css.input__error : ''}`}
            name="query"
            type="text"
            placeholder="Search recipes"
          />
          {error && <p className={css.error}>{error}</p>}
        </div>

        <button className={css.submit__btn} type="submit" disabled={isLoading}>
          {isLoading ? <Loader variant="button" size="small" /> : 'Search'}
        </button>
      </form>
    </>
  );
}

export default SearchBox;
