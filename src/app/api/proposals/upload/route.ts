import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import { randomUUID } from "crypto";
import { getCurrentSalesRep } from "../../../proposals/lib/auth";

const STORE_NAME = "proposal-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const rep = await getCurrentSalesRep();
  if (!rep) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "no file" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "invalid type — must be image" },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "file too large (max 5MB)" },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const key = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const store = getStore({ name: STORE_NAME, consistency: "strong" });
  await store.set(key, buffer, {
    metadata: { contentType: file.type, uploadedBy: rep.name },
  });

  // Return a URL that the frontend can use to fetch the image
  const url = `/api/proposals/upload/${key}`;
  return NextResponse.json({ url, key });
}
