import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { stampId } = await request.json();
  if (!stampId) {
    return NextResponse.json({ success: false, error: "stampId required" }, { status: 400 });
  }

  // Get all variants for this stampId, ordered by variant_id
  const { data: variants, error: fetchErr } = await supabaseAdmin
    .from("stamp_configs")
    .select("uuid, variant_id, is_active")
    .eq("stamp_id", stampId)
    .order("variant_id", { ascending: true });

  if (fetchErr || !variants || variants.length === 0) {
    return NextResponse.json({ success: false, error: "no variants found" }, { status: 404 });
  }

  const currentActive = variants.find(v => v.is_active);
  const currentIndex = currentActive ? variants.findIndex(v => v.uuid === currentActive.uuid) : -1;
  const nextIndex = (currentIndex + 1) % variants.length;
  const nextVariant = variants[nextIndex];

  // Deactivate current, activate next
  await supabaseAdmin.from("stamp_configs").update({ is_active: false }).eq("stamp_id", stampId);
  const { error: activateErr } = await supabaseAdmin
    .from("stamp_configs")
    .update({ is_active: true })
    .eq("uuid", nextVariant.uuid);

  if (activateErr) {
    return NextResponse.json({ success: false, error: activateErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, newUuid: nextVariant.uuid, variant_id: nextVariant.variant_id });
}
