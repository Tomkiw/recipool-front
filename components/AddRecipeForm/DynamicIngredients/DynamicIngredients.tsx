'use client';

import { Field, FieldArray, getIn } from 'formik';
import { useId } from 'react';
import type {
  AddRecipeFormValues,
  DynamicIngredientsProps,
} from '@/types/addRecipe';
import s from './DynamicIngredients.module.css';
import SelectedIngredientsList from './SelectedIngredientsList';

export default function DynamicIngredients({
  ingredients,
}: DynamicIngredientsProps) {
  const fieldId = useId();

  return (
    <FieldArray name="ingredientsList">
      {({ push, remove, form }) => {
        const values = form.values as AddRecipeFormValues;

        const selectedIngredient = ingredients.find(
          (ingredient) => ingredient.id === values.selectedIngredientId
        );

        const ingredientsList = values.ingredientsList || [];

        const ingredientsListError = getIn(form.errors, 'ingredientsList');
        const shouldShowIngredientsListError =
          typeof ingredientsListError === 'string' && form.submitCount > 0;

        const handleAddIngredient = () => {
          const amount = values.amount.trim();

          if (!selectedIngredient || !amount) {
            return;
          }

          const isAlreadyAdded = ingredientsList.some(
            (item) => item.id === selectedIngredient.id
          );

          if (isAlreadyAdded) {
            return;
          }

          push({
            id: selectedIngredient.id,
            name: selectedIngredient.name,
            measure: amount,
          });

          form.setFieldValue('selectedIngredientId', '');
          form.setFieldValue('amount', '');
        };

        return (
          <section className={s.wrapper}>
            <h3 className={s.sectionTitle}>Ingredients</h3>

            <div className={s.controls}>
              <div className={s.fieldGroup}>
                <label
                  className={s.label}
                  htmlFor={`${fieldId}-selectedIngredientId`}
                >
                  Name
                </label>

                <Field
                  className={s.select}
                  name="selectedIngredientId"
                  id={`${fieldId}-selectedIngredientId`}
                  as="select"
                >
                  <option value="">Select ingredient</option>

                  {ingredients.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </Field>
              </div>

              <div className={s.amountColumn}>
                <div className={s.fieldGroup}>
                  <label className={s.label} htmlFor={`${fieldId}-amount`}>
                    Amount
                  </label>

                  <Field
                    className={s.input}
                    name="amount"
                    id={`${fieldId}-amount`}
                    type="text"
                    placeholder="e.g. 100g"
                  />
                </div>
              </div>
                <button
                  type="button"
                  className={s.addButton}
                  onClick={handleAddIngredient}
                  disabled={!selectedIngredient || !values.amount.trim()}
                >
                  Add new Ingredient
                </button>
            </div>

            {shouldShowIngredientsListError && (
              <p className={s.error}>{ingredientsListError}</p>
            )}

            <SelectedIngredientsList
              ingredientsList={ingredientsList}
              onRemove={remove}
            />
          </section>
        );
      }}
    </FieldArray>
  );
}
