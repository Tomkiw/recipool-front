import { Recipe } from '@/types/recipe';
import { nextServer } from './api';

// Пошук/фільтри рецептів живуть у fetchRecipes у clientApi.ts (єдине джерело).

// Це для форми add-recipes
export interface AddRecipePayload {
  title: string;
  description: string;
  time: number;
  calories?: number;
  category: string;
  ingredients: { id: string; measure: string }[];
  instructions: string;
  photo?: File | null;
}

export async function addRecipe(payload: AddRecipePayload): Promise<Recipe> {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('description', payload.description);
  formData.append('time', String(payload.time));
  if (payload.calories !== undefined) formData.append('calories', String(payload.calories));
  formData.append('category', payload.category);
  formData.append('ingredients', JSON.stringify(payload.ingredients));
  formData.append('instructions', payload.instructions);
  if (payload.photo) formData.append('image', payload.photo);

  const { data } = await nextServer.post<Recipe>('/recipes', formData);
  return data;
}
