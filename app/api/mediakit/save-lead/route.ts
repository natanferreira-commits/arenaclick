import { NextRequest, NextResponse } from "next/server";
import { saveLeadToSheets } from "@/lib/sheets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await saveLeadToSheets({
      name: body.name,
      email: body.email,
      whatsapp: body.whatsapp || "",
      instagram: body.instagram || "",
      niche: body.niche || "",
      source: "media-kit",
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Save lead error:", err);
    // Não bloqueia o usuário se falhar
    return NextResponse.json({ ok: false, error: err.message }, { status: 200 });
  }
}
