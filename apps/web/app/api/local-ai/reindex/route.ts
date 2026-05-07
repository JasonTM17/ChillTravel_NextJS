import { NextResponse } from "next/server";
import { getReindexStatus } from "@/lib/local-ai";

export async function POST() {
  const payload = await getReindexStatus();
  return NextResponse.json({ success: true, data: payload.data, message: "Local RAG reindex status", meta: {} });
}
