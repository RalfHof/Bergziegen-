import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // Hole alle Feedbacks (nur tour_id und rating reichen)
  const { data, error } = await supabase
    .from("feedback")
    .select("tour_id, rating");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Durchschnitt pro Tour berechnen
  const ratings: Record<number, number> = {};
  const counts: Record<number, number> = {};

  data.forEach((row) => {
    const id = row.tour_id;
    const rating = row.rating;

    if (!ratings[id]) {
      ratings[id] = 0;
      counts[id] = 0;
    }
    ratings[id] += rating;
    counts[id] += 1;
  });

  // Mittelwert bilden
  Object.keys(ratings).forEach((id) => {
    ratings[+id] = ratings[+id] / counts[+id];
  });

  return NextResponse.json(ratings);
}
