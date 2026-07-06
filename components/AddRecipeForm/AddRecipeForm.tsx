'use client';

import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import { useId, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { addRecipeValidationSchema } from '@/lib/validation/addRecipeValidationSchema';
import { addRecipe } from '@/lib/api/recipesApi';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast';
import DynamicIngredients from './DynamicIngredients/DynamicIngredients';
import Loader from '@/components/Loader/Loader';
import s from './AddRecipesForm.module.css';
import { AddRecipeFormValues, AddRecipeFormProps } from '@/types/addRecipe';

function PhotoUpload() {
  const { setFieldValue } = useFormikContext<AddRecipeFormValues>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    if (file) {
      const url = URL.createObjectURL(file);
      prevUrlRef.current = url;
      setPreviewUrl(url);
      setFieldValue('photo', file);
    } else {
      prevUrlRef.current = null;
      setPreviewUrl(null);
      setFieldValue('photo', null);
    }
  }

  return (
    <div className={s.photoUpload} onClick={() => inputRef.current?.click()}>
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt="Recipe preview"
          fill
          className={s.photoPreview}
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <svg
          width="44"
          height="38"
          viewBox="0 0 38 32"
          aria-hidden="true"
          className={s.photoIcon}
        >
          <use href="/icons/icons.svg#icon-photo" />
        </svg>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={s.photoInput}
        onChange={handleChange}
      />
    </div>
  );
}

const initialValues: AddRecipeFormValues = {
  recipeTitle: '',
  recipeDescription: '',
  cookingTime: '',
  calories: '',
  category: '',
  photo: null,
  selectedIngredientId: '',
  amount: '',
  ingredientsList: [],
  instructions: '',
};

export default function AddRecipeForm({
  ingredients,
  categories,
}: AddRecipeFormProps) {
  const fieldId = useId();
  const router = useRouter();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={addRecipeValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const recipe = await addRecipe({
            title: values.recipeTitle,
            description: values.recipeDescription,
            time: Number(values.cookingTime),
            calories: values.calories !== '' ? Number(values.calories) : undefined,
            category: values.category,
            ingredients: values.ingredientsList.map(({ id, measure }) => ({
              id,
              measure,
            })),
            instructions: values.instructions,
            photo: values.photo,
          });
          showSuccessToast('Recipe published successfully!');
          router.push(`/recipes/${recipe._id}`);
        } catch {
          showErrorToast('Failed to publish recipe. Please try again.');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, isSubmitting }) => (
        <Form className={s.form}>
          {isSubmitting && (
            <div className={s.loaderOverlay}>
              <Loader
                variant="section"
                size="large"
                text="Publishing recipe..."
              />
            </div>
          )}
          <h2 className={s.pageTitle}>Add Recipe</h2>

          <section className={s.mainSection}>
            <div className={s.generalGrid}>
              <h3 className={s.sectionTitle}>General Information</h3>

              <div className={s.fieldGroup}>
                <label className={s.label} htmlFor={`${fieldId}-recipeTitle`}>
                  Recipe Title
                </label>
                <Field
                  className={s.input}
                  name="recipeTitle"
                  id={`${fieldId}-recipeTitle`}
                  type="text"
                  placeholder="Enter the name of your recipe"
                />
                <ErrorMessage
                  name="recipeTitle"
                  component="p"
                  className={s.error}
                />
              </div>

              <div className={s.fieldGroup}>
                <label
                  className={s.label}
                  htmlFor={`${fieldId}-recipeDescription`}
                >
                  Recipe Description
                </label>
                <Field
                  className={s.textarea}
                  name="recipeDescription"
                  id={`${fieldId}-recipeDescription`}
                  as="textarea"
                  placeholder="Enter a brief description of your recipe"
                />
                <ErrorMessage
                  name="recipeDescription"
                  component="p"
                  className={s.error}
                />
              </div>

              <div className={s.fieldGroup}>
                <label className={s.label} htmlFor={`${fieldId}-cookingTime`}>
                  Cooking time in minutes
                </label>
                <Field
                  className={s.input}
                  name="cookingTime"
                  id={`${fieldId}-cookingTime`}
                  type="number"
                  min={1}
                  max={360}
                  inputMode="numeric"
                  placeholder="10"
                />
                <ErrorMessage
                  name="cookingTime"
                  component="p"
                  className={s.error}
                />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label} htmlFor={`${fieldId}-calories`}>
                  Calories
                </label>
                <Field
                  className={s.input}
                  name="calories"
                  id={`${fieldId}-calories`}
                  type="text"
                  inputMode="numeric"
                  placeholder="150 cals"
                />
                <ErrorMessage
                  name="calories"
                  component="p"
                  className={s.error}
                />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label} htmlFor={`${fieldId}-category`}>
                  Category
                </label>
                <Field
                  className={`${s.select} ${!values.category ? s.selectPlaceholder : ''}`}
                  name="category"
                  id={`${fieldId}-category`}
                  as="select"
                >
                  <option value="" disabled hidden>
                    Soup
                  </option>
                  {categories.map(({ _id, name }) => (
                    <option key={_id} value={name}>
                      {name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="category"
                  component="p"
                  className={s.error}
                />
              </div>
            </div>

            <DynamicIngredients ingredients={ingredients} />

            <div className={s.fieldGroup}>
              <label
                className={s.instructionTitle}
                htmlFor={`${fieldId}-instructions`}
              >
                Instructions
              </label>
              <Field
                className={s.textarea}
                name="instructions"
                id={`${fieldId}-instructions`}
                as="textarea"
                placeholder="Enter a text"
              />
              <ErrorMessage
                name="instructions"
                component="p"
                className={s.error}
              />
            </div>

            <button
              type="submit"
              className={s.btnPrimary}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Recipe'}
            </button>
          </section>

          <section className={s.photoSection}>
            <h3 className={s.photoLabel}>Upload Photo</h3>
            <PhotoUpload />
          </section>
        </Form>
      )}
    </Formik>
  );
}
