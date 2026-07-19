import { cookies } from 'next/headers';
import { User } from '@/types/user';
import { FetchRecipesResponse } from './clientApi';
import { api } from '@/app/api/api';
import { Recipe } from '@/types/recipe';
import { isAxiosError } from 'axios';
import { parse } from 'cookie';
import { normalizeFavoritesResponse } from './normalizeFavorites';

const applySetCookieToStore = (
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  setCookieHeader?: string | string[]
) => {
  if (!setCookieHeader) {
    return;
  }

  const cookieArray = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  for (const cookieStr of cookieArray) {
    const parsed = parse(cookieStr);

    const options = {
      expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
      path: parsed.Path,
      maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
    };

    if (parsed.accessToken) {
      cookieStore.set('accessToken', parsed.accessToken, options);
    }
    if (parsed.refreshToken) {
      cookieStore.set('refreshToken', parsed.refreshToken, options);
    }
    if (parsed.sessionId) {
      cookieStore.set('sessionId', parsed.sessionId, options);
    }
  }
};

export const checkServerSession = async (cookieHeader?: string) => {
  const cookieStore = await cookies();
  const finalCookies = cookieHeader || cookieStore.toString();

  const res = await api.post(
    '/auth/refresh',
    {},
    {
      headers: {
        Cookie: finalCookies,
      },
    }
  );

  applySetCookieToStore(cookieStore, res.headers['set-cookie']);

  return res;
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();

  try {
    const { data } = await api.get('/users/current', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      try {
        await checkServerSession(cookieStore.toString());

        const { data } = await api.get('/users/current', {
          headers: {
            Cookie: cookieStore.toString(),
          },
        });
        return data;
      } catch {
        throw error;
      }
    }
    throw error;
  }
};

interface FetchServerParams {
  page: number;
  perPage?: number;
  search?: string;
  category?: string;
  ingredient?: string;
}

export async function fetchRecipesServer({
  page,
  perPage = 12,
  search,
  category,
  ingredient,
}: FetchServerParams): Promise<FetchRecipesResponse> {
  try {
    const cookieStore = await cookies();

    // The backend names the title-search param "keyword" and rejects unknown keys.
    const params = {
      page,
      perPage,
      keyword: search || undefined,
      category: category || undefined,
      ingredient: ingredient || undefined,
    };
    const res = await api.get('/api/recipes', {
      params,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return res.data;
  } catch (error) {
    console.error('Server fetch error:', error);

    return {
      page: 1,
      perPage: 12,
      totalRecipes: 0,
      totalPages: 0,
      recipes: [],
    };
  }
}

export async function fetchRecipeByIdServer(
  recipeId: string
): Promise<Recipe | null> {
  const cookieStore = await cookies();

  try {
    const res = await api.get(`/api/recipes/${recipeId}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return res.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404 || status === 400) {
        return null;
      }
    }
    throw error;
  }
}
// === ДОДАТИ В КІНЕЦЬ ФАЙЛУ serverApi.ts ===

// Отримання власних рецептів на сервері (перша сторінка)
export async function fetchMyRecipesServer(
  page: number = 1
): Promise<FetchRecipesResponse> {
  try {
    const cookieStore = await cookies();
    const res = await api.get('/api/my/recipes', {
      params: { page, perPage: 12 },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return res.data;
  } catch (error) {
    console.error('Server fetch my recipes error:', error);
    return {
      page: 1,
      perPage: 12,
      totalRecipes: 0,
      totalPages: 0,
      recipes: [],
    };
  }
}

// Отримання улюблених рецептів на сервері (перша сторінка)
export async function fetchFavoriteRecipesServer(
  page: number = 1
): Promise<FetchRecipesResponse> {
  try {
    const cookieStore = await cookies();
    const res = await api.get('/api/recipes/favorites', {
      params: { page, perPage: 12 },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return normalizeFavoritesResponse(res.data);
  } catch (error) {
    console.error('Server fetch favorite recipes error:', error);
    return {
      page: 1,
      perPage: 12,
      totalRecipes: 0,
      totalPages: 0,
      recipes: [],
    };
  }
}
