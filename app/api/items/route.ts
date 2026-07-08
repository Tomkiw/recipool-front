import { NextRequest, NextResponse } from 'next/server';
import { api } from '../api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../_utils/utils';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const { searchParams } = request.nextUrl;

    const keyword = searchParams.get('keyword') || undefined;
    const page = Number(searchParams.get('page')) || 1;
    const category = searchParams.get('category') || undefined;
    const ingredient = searchParams.get('ingredient') || undefined;

    const params = {
      page,
      perPage: 12,
      keyword,
      category,
      ingredient,
    };

    const res = await api('/api/recipes', {
      params,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);

      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const backendUrl = process.env.NEXT_BACKEND_API_URL;
    const contentType = request.headers.get('content-type');

    const response = await fetch(`${backendUrl}/api/recipes`, {
      method: 'POST',
      headers: {
        Cookie: cookieStore.toString(),
        ...(contentType && { 'Content-Type': contentType }),
      },
      body: request.body,
      // @ts-expect-error duplex is required for streaming body in Node.js fetch
      duplex: 'half',
    });

    const data = await response.json();
    if (!response.ok) logErrorResponse(data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
