import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logErrorResponse } from '../../_utils/utils';

// The backend mounts the avatar endpoint without the /api prefix.
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const backendUrl =
      process.env.NEXT_BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const contentType = request.headers.get('content-type');

    const response = await fetch(`${backendUrl}/users/avatar`, {
      method: 'PATCH',
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
