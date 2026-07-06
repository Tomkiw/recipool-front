import * as Yup from 'yup';

export const addRecipeValidationSchema = Yup.object({
  recipeTitle: Yup.string().trim().max(64, 'Title cannot exceed 64 characters').required('Recipe title is required'),
  recipeDescription: Yup.string().trim().max(200, 'Description cannot exceed 200 characters').required('Recipe description is required'),
  cookingTime: Yup.number()
    .min(1, 'Cooking time must be at least 1 minute')
    .max(360, 'Cooking time cannot exceed 360 minutes')
    .required('Cooking time is required'),
  calories: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .nullable()
    .integer('Calories must be a whole number')
    .min(1, 'Calories must be at least 1')
    .max(10000, 'Calories cannot exceed 10000')
    .optional(),
  category: Yup.string().required('Category is required'),
  instructions: Yup.string().trim().max(1200, 'Instructions cannot exceed 1200 characters').required('Instructions are required'),
  ingredientsList: Yup.array()
    .of(
      Yup.object({
        id: Yup.string().required('Please select an ingredient'),
        measure: Yup.string().trim().required('Please enter the amount'),
      })
    )
    .min(2, 'Please add at least 2 ingredients')
    .max(16, 'Cannot add more than 16 ingredients'),
});
