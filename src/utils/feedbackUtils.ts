export type FeedbackEntry = {
  id?: number;
  tour_id?: number; // falls DB tour_id heißt
  tourId?: number;  // falls DB tourId heißt
  rating: number;
  comment?: string | null;
  created_at?: string;
};

// Durchschnittsbewertung laden
export async function getAverageRating(tourId: number): Promise<number> {
  try {
    const res = await fetch(`/api/feedback?tourId=${tourId}`, {
      cache: "no-store",
    });

    if (!res.ok) return 0;
    const data: FeedbackEntry[] = await res.json();

    const tourFeedback = data.filter(
      (f) => (f.tour_id ?? f.tourId) === tourId
    );

    if (tourFeedback.length === 0) return 0;

    const sum = tourFeedback.reduce((acc, f) => acc + (f.rating ?? 0), 0);
    return sum / tourFeedback.length;
  } catch (err) {
    console.error("Fehler beim Laden der Bewertung:", err);
    return 0;
  }
}
