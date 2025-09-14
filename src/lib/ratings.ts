import supabase from "@/lib/supabaseClient";

// Typ für Feedback
export type FeedbackEntry = {
  id: number;
  tourId: number;
  rating: number;
  comment: string;
  created_at: string;
};

// Durchschnittsbewertung laden
export async function getAverageRating(tourId: number): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("rating")
      .eq("tourId", tourId);

    if (error) throw error;
    if (!data || data.length === 0) return 0;

    const avg =
      data.reduce((sum, f) => sum + f.rating, 0) / data.length;

    return avg;
  } catch (err) {
    console.error("Fehler beim Laden der Bewertung:", err);
    return 0;
  }
}
