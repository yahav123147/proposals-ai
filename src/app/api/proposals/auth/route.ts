import { NextRequest, NextResponse } from "next/server";
import {
  checkPassword,
  clearSession,
  setSession,
} from "../../../proposals/lib/auth";
import { getSalesRepById } from "../../../proposals/lib/sales-reps";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const password = body.password as string | undefined;
  const salesRepId = body.salesRepId as string | undefined;

  if (!password || !salesRepId) {
    return NextResponse.json(
      { error: "missing fields" },
      { status: 400 }
    );
  }
  if (!checkPassword(password)) {
    return NextResponse.json({ error: "wrong password" }, { status: 401 });
  }
  const rep = getSalesRepById(salesRepId);
  if (!rep) {
    return NextResponse.json({ error: "invalid sales rep" }, { status: 400 });
  }
  await setSession(salesRepId);
  return NextResponse.json({ ok: true, salesRep: rep });
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
