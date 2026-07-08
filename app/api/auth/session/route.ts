import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

const applySetCookieToResponse = (
  response: NextResponse,
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
      response.cookies.set('accessToken', parsed.accessToken, options);
    }
    if (parsed.refreshToken) {
      cookieStore.set('refreshToken', parsed.refreshToken, options);
      response.cookies.set('refreshToken', parsed.refreshToken, options);
    }
    if (parsed.sessionId) {
      cookieStore.set('sessionId', parsed.sessionId, options);
      response.cookies.set('sessionId', parsed.sessionId, options);
    }
  }
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (accessToken) {
      return NextResponse.json({ success: true });
    }

    if (refreshToken) {
      const apiRes = await api.post(
        '/auth/refresh',
        {},
        {
          headers: {
            Cookie: cookieStore.toString(),
          },
        }
      );

      const response = NextResponse.json({ success: true }, { status: 200 });
      applySetCookieToResponse(
        response,
        cookieStore,
        apiRes.headers['set-cookie']
      );
      return response;
    }

    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.response?.status || 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
