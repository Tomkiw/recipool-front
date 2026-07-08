import AddRecipeForm from '@/components/AddRecipeForm/AddRecipeForm';
import { getIngredients } from '@/lib/api/ingredientsApi'; // TODO: створити цей файл
import { getCategories } from '@/lib/api/categoriesApi';

export default async function AddRecipePage() {
  const [ingredients, categories] = await Promise.all([
    getIngredients().catch(() => []),
    getCategories().catch(() => []),
  ]);

  return <AddRecipeForm ingredients={ingredients} categories={categories} />;
}
