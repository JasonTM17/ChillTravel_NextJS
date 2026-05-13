import { NextResponse } from 'next/server';

/**
 * POST /api/vitals — Receives Core Web Vitals metrics from the client (Req 5.4).
 *
 * Expected payload:
 *   { name: "LCP" | "CLS" | "INP", value: number, id: string, navigationType: string }
 *
 * Logs vitals in structured format for observability.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      value?: number;
      id?: string;
      navigationType?: string;
      rating?: string;
    };

    if (!body.name || typeof body.value !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Invalid vitals payload' },
        { status: 400 },
      );
    }

    // Structured log output (Req 5.4)
    const logEntry = {
      type: 'web-vital',
      metric: body.name,
      value: body.value,
      id: body.id ?? 'unknown',
      navigationType: body.navigationType ?? 'unknown',
      rating: body.rating ?? 'unknown',
      timestamp: new Date().toISOString(),
    };

    // Log to stdout in structured JSON format
    // In production, this would be picked up by a log aggregator
    console.info(JSON.stringify(logEntry));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to process vitals' },
      { status: 500 },
    );
  }
}
