import RecipeList from '@/components/RecipesList/RecipesList';
import Hero from '@/components/Hero/Hero';
import { fetchRecipesServer } from '@/lib/api/serverApi';

export default async function App() {
  // 2. Робимо запит до бекенду НА СЕРВЕРІ перед тим, як віддати сторінку
  const initialData = await fetchRecipesServer({
    page: 1,
    perPage: 12,
    search: '', // За замовчуванням порожньо
    category: '', // За замовчуванням порожньо
  });

  return (
    <>
      <Hero />
      {/* 3. Передаємо СПРАВЖНІ дані замість порожніх заглушок */}
      <RecipeList
        initialRecipes={initialData.recipes}
        totalPages={initialData.totalPages}
        totalRecipes={initialData.totalRecipes}
        searchQuery=""
        currentCategory=""
      />
    </>
  );
}
