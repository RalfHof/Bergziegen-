// src/utils/feedbackUtils.ts
export type FeedbackEntry = {
  id: number;
  tour_id: number;
  rating: number;
  comment?: string;
  created_at: string;
};

export async function getAverageRating(tourId: number): Promise<number> {
  try {
    const res = await fetch(`/api/feedback?tourId=${tourId}`, {
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const data: FeedbackEntry[] = await res.json();
    if (data.length === 0) return 0;
    const avg = data.reduce((sum, f) => sum + f.rating, 0) / data.length;
    return avg;
  } catch (err) {
    console.error("Fehler beim Laden der Bewertung:", err);
    return 0;
  }
}
