// src/utils/feedbackUtils.ts
export type RatingsMap = Record<number, number>;

export async function getAllAverageRatings(): Promise<RatingsMap> {
  try {
    const res = await fetch("/api/feedback/ratings", { cache: "no-store" });
    if (!res.ok) return {};
    const data = await res.json();
    // API gibt Objekt { "1": 4.2, "2": 3.5, ... }
    return data as RatingsMap;
  } catch (err) {
    console.error("Fehler beim Laden der Ratings:", err);
    return {};
  }
}

export async function getAverageRating(tourId: number): Promise<number> {
  const map = await getAllAverageRatings();
  return map[tourId] ?? 0;
}
