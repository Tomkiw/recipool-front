import type { IngredientOption } from './ingredient';
import type { Category } from './category';

export interface RecipeIngredientItem {
  id: string;
  name: string;
  measure: string;
}

export interface AddRecipeFormValues {
  recipeTitle: string;
  recipeDescription: string;
  cookingTime: number | '';
  calories: number | '';
  category: string;
  photo: File | null;
  selectedIngredientId: string;
  amount: string;
  ingredientsList: RecipeIngredientItem[];
  instructions: string;
}

export interface AddRecipeFormProps {
  ingredients: IngredientOption[];
  categories: Category[];
}

export interface DynamicIngredientsProps {
  ingredients: IngredientOption[];
}