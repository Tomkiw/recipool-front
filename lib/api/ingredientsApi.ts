import type { IngredientOption, IngredientOptionFilter } from '@/types/ingredient';
import { nextServer } from './api';

interface BackendIngredient {
  _id: string;
  id?: string;
  name: string;
  desc?: string;
  img?: string;
}

export async function getIngredients(): Promise<IngredientOption[]> {
  const { data } = await nextServer.get<BackendIngredient[]>('/ingredients');
  return data.map((ingredient) => ({
    id: ingredient.id ?? ingredient._id,
    name: ingredient.name,
  }));
}

export async function getIngredientsFilter(): Promise<
  IngredientOptionFilter[]
> {
  const res = await fetch('/api/ingredients');
  if (!res.ok) throw new Error('Failed to fetch ingredients');
  return res.json();
}

