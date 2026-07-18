import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { logErrorResponse } from '../../_utils/utils';
import { isAxiosError } from 'axios';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const { searchParams } = request.nextUrl;

    const res = await api('/api/recipes/favorites', {
      params: {
        page: Number(searchParams.get('page')) || 1,
        perPage: Number(searchParams.get('perPage')) || 12,
      },
      headers: { Cookie: cookieStore.toString() },
    });

    // The favorites endpoint counts with "totalFavorites" instead of "totalRecipes".
    const { totalFavorites, ...rest } = res.data;
    return NextResponse.json(
      { ...rest, totalRecipes: totalFavorites ?? 0 },
      { status: res.status }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
