'use client';

import { useId, useState } from 'react';
import type { RecipeIngredient } from '@/types/ingredient';
import css from './IngredientsChecklist.module.css';

interface IngredientsChecklistProps {
  ingredients: RecipeIngredient[];
}

const PERCENT = 100;

export default function IngredientsChecklist({
  ingredients,
}: IngredientsChecklistProps) {
  const headingId = useId();
  // Відмітки живуть лише в браузері: це помічник «під час готування», а не дані.
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const total = ingredients.length;
  const doneCount = ingredients.filter(({ id }) =>
    checkedIds.has(id._id)
  ).length;
  const progress = total > 0 ? Math.round((doneCount / total) * PERCENT) : 0;

  const toggle = (ingredientId: string) => {
    setCheckedIds((previous) => {
      const next = new Set(previous);
      if (next.has(ingredientId)) {
        next.delete(ingredientId);
      } else {
        next.add(ingredientId);
      }
      return next;
    });
  };

  return (
    <aside className={css.card} aria-labelledby={headingId}>
      <div className={css.header}>
        <h2 id={headingId} className={css.title}>
          Ingredients
        </h2>
        <span className={css.counter}>
          {doneCount} of {total} ready
        </span>
      </div>

      <div
        className={css.progress}
        role="progressbar"
        aria-label="Ingredients ready"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={doneCount}
      >
        <div className={css.progressBar} style={{ width: `${progress}%` }} />
      </div>

      {total === 0 ? (
        <p className={css.empty}>No ingredients listed for this recipe.</p>
      ) : (
        <ul className={css.list}>
          {ingredients.map(({ id: ingredient, measure }) => {
            const isChecked = checkedIds.has(ingredient._id);
            return (
              <li key={ingredient._id} className={css.item}>
                <label className={css.label}>
                  <input
                    type="checkbox"
                    className={css.checkbox}
                    checked={isChecked}
                    onChange={() => toggle(ingredient._id)}
                  />
                  <span
                    className={`${css.name} ${isChecked ? css.nameChecked : ''}`}
                  >
                    {ingredient.name}
                  </span>
                  <span className={css.measure}>{measure}</span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
