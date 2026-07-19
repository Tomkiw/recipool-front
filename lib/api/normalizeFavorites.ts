import type { FetchRecipesResponse } from './clientApi';

// The favorites endpoint counts with "totalFavorites" instead of "totalRecipes",
// so every caller has to map it back onto the shared pagination shape.
type FavoritesApiResponse = Omit<FetchRecipesResponse, 'totalRecipes'> & {
  totalFavorites?: number;
};

export function normalizeFavoritesResponse(
  data: FavoritesApiResponse
): FetchRecipesResponse {
  const { totalFavorites, ...rest } = data;
  return { ...rest, totalRecipes: totalFavorites ?? 0 };
}
