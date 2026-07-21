import type { IngredientOption } from '@/types/ingredient';

interface BackendIngredient {
  _id: string;
  id?: string;
  name: string;
  desc?: string;
  img?: string;
}

// Єдине джерело правди для списку інгредієнтів. Ізоморфна, як getCategories:
// server component — абсолютний URL напряму на бекенд, client — відносний
// через Next.js proxy. Повертає нормалізовану форму { id, name }.
export async function getIngredients(): Promise<IngredientOption[]> {
  const url =
    typeof window === 'undefined'
      ? `${process.env.NEXT_BACKEND_API_URL}/api/ingredients`
      : '/api/ingredients';

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch ingredients');

  const data: BackendIngredient[] = await res.json();
  return data.map((ingredient) => ({
    id: ingredient.id ?? ingredient._id,
    name: ingredient.name,
  }));
}
