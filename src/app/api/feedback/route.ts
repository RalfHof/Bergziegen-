// src/app/api/feedback/route.ts
import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient"; // Pfad zu deinem Supabase-Client

// GET: alle Feedbacks oder nur für tourId -> /api/feedback?tourId=3
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tourIdParam = url.searchParams.get("tourId");

    let query = supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (tourIdParam) {
      const tourId = parseInt(tourIdParam, 10);
      if (!Number.isNaN(tourId)) {
        // Achtung: hier nutze ich die DB-Spalte 'tour_id'
        query = query.eq("tour_id", tourId);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase GET /feedback error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("GET /api/feedback unexpected error:", err);
    return NextResponse.json({ error: message || "Serverfehler" }, { status: 500 });
  }
}

// POST: neues Feedback speichern
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tourId, rating, comment } = body;

    // Validieren
    if (typeof tourId !== "number" || typeof rating !== "number") {
      return NextResponse.json(
        { error: "tourId (number) und rating (number) sind erforderlich" },
        { status: 400 }
      );
    }

    // Insert: wir speichern in DB-Spalte 'tour_id'
    const { data, error } = await supabase
      .from("feedback")
      .insert([{ tour_id: tourId, rating, comment }])
      .select();

    if (error) {
      console.error("Supabase INSERT /feedback error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data?.[0] ?? null);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("POST /api/feedback unexpected error:", err);
    return NextResponse.json({ error: message || "Ungültige Anfrage" }, { status: 400 });
  }
}
