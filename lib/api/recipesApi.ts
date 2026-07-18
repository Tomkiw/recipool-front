import { Recipe } from '@/types/recipe';
import { nextServer } from './api';
import { SearchFilters } from '@/types/filters';

export interface FetchNotesResponse {
  page: number;
  perPage: number;
  recipes: Recipe[];
  totalPages: number;
  totalRecipes: number;
}

export async function fetchRecipes({
  keyword,
  category,
  ingredient,
}: SearchFilters): Promise<FetchNotesResponse> {

  const params = new URLSearchParams();

  if (keyword && keyword.trim() !== '') params.set('keyword', keyword.trim());
  if (category && category.trim() !== '') params.set('category', category.trim());
  if (ingredient && ingredient.trim() !== '') params.set('ingredient', ingredient.trim());

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`/api/recipes${query}`);
  if (!res.ok) throw new Error('Failed to fetch recipes');
  return res.json();
}

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
