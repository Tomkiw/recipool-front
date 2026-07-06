import s from './DynamicIngredients.module.css';
import type { RecipeIngredientItem } from '@/types/addRecipe';

interface SelectedIngredientsListProps {
  ingredientsList: RecipeIngredientItem[];
  onRemove: (index: number) => void;
}

export default function SelectedIngredientsList({
  ingredientsList,
  onRemove,
}: SelectedIngredientsListProps) {
  const hasItems = ingredientsList.length > 0;
  return (
    <>
      <div className={s.listHeader} data-has-items={hasItems}>
        <span>Name:</span>
        <span>Amount:</span>
        <span className={s.actionHeader}>Action</span>
      </div>

      <ul className={s.ingredientList}>
        {ingredientsList.map((item, index) => (
          <li
            key={`${item.id}-${index}`}
            className={s.ingredientItem}
          >
            <span className={s.ingredientName}>{item.name}</span>
            <span className={s.ingredientAmount}>{item.measure}</span>

            <button
              type="button"
              className={s.removeButton}
              onClick={() => onRemove(index)}
              aria-label={`Remove ${item.name}`}
            >
              <svg className={s.deleteIcon} aria-hidden="true">
                <use href="/icons/icons.svg#icon-delete" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
