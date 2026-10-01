'use client';

import ErrorState from '@/components/ErrorState/ErrorState';
import css from './RecipeDetails.module.css';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

// Next передає reset, який повторно рендерить сегмент — це і є «Try again».
const RecipeError = ({ reset }: Props) => {
  return (
    <div className={css.container}>
      <ErrorState
        title="We couldn’t load this recipe"
        text="Something went wrong on our side. Check your connection and try again."
        onRetry={reset}
      />
    </div>
  );
};

export default RecipeError;
