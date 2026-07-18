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

  const description = (recipe.description ?? '').slice(0, 160);
  const ogImage = recipe.thumb || recipe.image || '/not-found.jpg';

  return {
    title: `Recipe: ${recipe.title}`,
    description,
    openGraph: {
      title: `Recipe: ${recipe.title}`,
      description,
      url: `/recipes/${recipeId}`,
      siteName: 'Tasteorama',
      images: [
        {
          url: ogImage,
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
