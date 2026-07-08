import { NextResponse } from 'next/server';

export async function GET() {
  const backendUrl = process.env.NEXT_BACKEND_API_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { error: 'NEXT_BACKEND_API_URL is not configured' },
      { status: 500 }
    );
  }

  const response = await fetch(`${backendUrl}/api/categories`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: response.status }
    );
  }

  const data = await response.json();

  return NextResponse.json(data);
}
