import { NextResponse } from 'next/server';
import { getStructuredChatAnswer } from '@/lib/local-ai';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    message?: string;
    contextSlug?: string;
  };
  const message =
    typeof body.message === 'string' && body.message.trim()
      ? body.message
      : 'Đà Nẵng đi 3 ngày ăn gì?';
  const data = await getStructuredChatAnswer(message, body.contextSlug);
  return NextResponse.json({ success: true, data, message: 'Local concierge response', meta: {} });
}
