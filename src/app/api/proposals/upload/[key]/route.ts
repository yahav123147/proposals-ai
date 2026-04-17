import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

const STORE_NAME = "proposal-images";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ key: string }> }
) {
  const { key } = await ctx.params;
  const store = getStore({ name: STORE_NAME, consistency: "strong" });
  const result = await store.getWithMetadata(key, { type: "arrayBuffer" });
  if (!result) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }
  const contentType =
    (result.metadata?.contentType as string | undefined) || "image/jpeg";
  return new NextResponse(result.data as ArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
