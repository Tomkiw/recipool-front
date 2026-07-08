import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import RecipeDetailsClient from './RecipeDetails.client';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchRecipeByIdServer } from '@/lib/api/serverApi';

type Props = {
  params: Promise<{ recipeId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { recipeId } = await params;

  const recipe = await fetchRecipeByIdServer(recipeId);

  if (!recipe) {
    return { title: 'Рецепт не знайдено' };
  }

  return {
    title: `Recipe: ${recipe.title}`,
    description: recipe.description.slice(0, 30),
    openGraph: {
      title: `Recipe: ${recipe.title}`,
      description: recipe.description.slice(0, 100),
      url: `https://notehub.com/notes/${recipeId}`,
      siteName: 'Tasteorama',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: recipe.title,
        },
      ],
      type: 'article',
    },
  };
}

const RecipeDetails = async ({ params }: Props) => {
  const { recipeId } = await params;

  const recipe = await fetchRecipeByIdServer(recipeId);
  if (!recipe) notFound();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => fetchRecipeByIdServer(recipeId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecipeDetailsClient />
    </HydrationBoundary>
  );
};

export default RecipeDetails;
