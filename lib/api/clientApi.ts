import { Recipe } from '@/types/recipe';
import { nextServer } from './api';
import { User } from '@/types/user';

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};
export type LoginRequest = {
  email: string;
  password: string;
};

type CheckSessionRequest = {
  success: boolean;
};

export type UpdateAvatarResponse = {
  url: string;
};

export const updateAvatar = async (
  file: File
): Promise<UpdateAvatarResponse> => {
  const formData = new FormData();
  formData.append('avatar', file);

  const res = await nextServer.patch<UpdateAvatarResponse>(
    '/users/avatar',
    formData
  );
  return res.data;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.response?.message || err?.error || 'Login failed');
  }
  return res.json();
};

export const logout = async (): Promise<void> => {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
};

export const getMe = async () => {
  const { data } = await nextServer.get<User>('/users/current');
  return data;
};

export const checkSession = async (): Promise<boolean> => {
  const res = await fetch('/api/auth/session', { credentials: 'include' });
  if (!res.ok) return false;
  const data: CheckSessionRequest = await res.json();
  return data.success;
};

export const register = async (data: RegisterRequest): Promise<User> => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.response?.message || err?.error || 'Registration failed'
    );
  }
  return res.json();
};

export interface FetchRecipesResponse {
  page: number;
  perPage: number;
  totalRecipes: number;
  totalPages: number;
  recipes: Recipe[];
}

export async function fetchRecipes(
  page: number = 1,
  query: string = '',
  category?: string,
  ingredient?: string
): Promise<FetchRecipesResponse> {
  const params = {
    keyword: query,
    page,
    perPage: 12,
    category,
    ingredient,
  };

  const { data } = await nextServer.get<FetchRecipesResponse>('/recipes', {
    params,
  });

  return data;
}

export async function fetchRecipeById(recipeId: string): Promise<Recipe> {
  const { data } = await nextServer.get<{ data: Recipe }>(
    `/recipes/${recipeId}`
  );
  return data.data;
}

export interface AddFavoriteResponse {
  status: number;
  message: string;
  data: string[];
}

export interface RemoveFavoriteResponse {
  status: number;
  message: string;
  data: {
    recipeId: string;
  };
}

export async function addToFavorites(
  recipeId: string
): Promise<AddFavoriteResponse> {
  const { data } = await nextServer.post(`/recipes/${recipeId}/favorite`);
  return data;
}

export async function removeFromFavorites(
  recipeId: string
): Promise<RemoveFavoriteResponse> {
  const { data } = await nextServer.delete(`/recipes/${recipeId}/favorite`);
  return data;
}

export interface DeleteRecipeResponse {
  status: number;
  message: string;
  data: {
    recipeId: string;
  };
}

// Видалити можна лише власний рецепт (бек віддасть 403 для чужого).
export async function deleteRecipe(
  recipeId: string
): Promise<DeleteRecipeResponse> {
  const { data } = await nextServer.delete(`/recipes/${recipeId}`);
  return data;
}

export async function fetchMyRecipes(
  page: number = 1
): Promise<FetchRecipesResponse> {
  const { data } = await nextServer.get<FetchRecipesResponse>('/my/recipes', {
    params: { page, perPage: 12 },
  });
  return data;
}

// Отримання улюблених рецептів з пагінацією для клієнта
export async function fetchFavoriteRecipes(
  page: number = 1
): Promise<FetchRecipesResponse> {
  const { data } = await nextServer.get<FetchRecipesResponse>(
    '/recipes/favorites',
    {
      params: { page, perPage: 12 },
    }
  );
  return data;
}
