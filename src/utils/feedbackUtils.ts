export type RatingsMap = Record<number, number>;

export async function getAllAverageRatings(): Promise<RatingsMap> {
  try {
    const res = await fetch('/api/feedback/ratings', { cache: 'no-store' });
    if (!res.ok) return {};
    const data = (await res.json()) as Record<string, number>;
    const map: RatingsMap = {};
    Object.entries(data).forEach(([k, v]) => {
      map[Number(k)] = Number(v);
    });
    return map;
  } catch (err) {
    console.error('Error loading ratings', err);
    return {};
  }
}

export async function getAverageRating(tourId: number): Promise<number> {
  try {
    const res = await fetch(`/api/feedback?tourId=${tourId}`, { cache: 'no-store' });
    if (!res.ok) return 0;
    const data = (await res.json()) as { rating: number }[];
    if (!data || data.length === 0) return 0;
    return data.reduce((s, d) => s + d.rating, 0) / data.length;
  } catch (err) {
    console.error('Error loading rating for tour', err);
    return 0;
  }
}
