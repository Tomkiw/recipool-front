import { NextResponse } from 'next/server';
import { api } from '../../../api';
import { cookies } from 'next/headers';
import { logErrorResponse } from '../../../_utils/utils';
import { isAxiosError } from 'axios';

type Props = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Props) {
  try {
    const cookieStore = await cookies();
    const { id } = await params;
    const res = await api.post(`api/recipes/${id}/favorite`, null, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  console.log('DELETE /favorite hit');
  try {
    const cookieStore = await cookies();
    const { id } = await params;
    const res = await api.delete(`api/recipes/${id}/favorite`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
