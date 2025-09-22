"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface FeedbackProps {
  tourId: number;
  onNewRating?: (newAverage: number) => void;
}

interface FeedbackEntry {
  tour_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

export default function Feedback({ tourId, onNewRating }: FeedbackProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>([]);

  const loadFeedbacks = useCallback(async () => {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("tour_id", tourId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setFeedbackList(data as FeedbackEntry[]);
    }
  }, [tourId]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      alert("Bitte mindestens 1 Stern wählen.");
      return;
    }
    setLoading(true);

    const { error } = await supabase.from("feedback").insert([
      {
        tour_id: tourId,
        rating,
        comment: comment || null,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Fehler beim Speichern: " + error.message);
      return;
    }

    const newEntry: FeedbackEntry = {
      tour_id: tourId,
      rating,
      comment: comment || null,
      created_at: new Date().toISOString(),
    };

    const updatedFeedbacks = [newEntry, ...feedbackList];
    setFeedbackList(updatedFeedbacks);

    const sum = updatedFeedbacks.reduce((acc, f) => acc + f.rating, 0);
    const avg = sum / updatedFeedbacks.length;

    if (onNewRating) onNewRating(avg);

    setRating(0);
    setComment("");
  };

  return (
    <div style={{ marginTop: "2rem", width: "100%", maxWidth: "700px" }}>
      <h3>Bewertung abgeben</h3>
      <form onSubmit={handleSubmit}>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                fontSize: "1.4rem",
                background: "transparent",
                border: "none",
                color: star <= rating ? "gold" : "lightgray",
              }}
              aria-label={`Sterne ${star}`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Kommentar schreiben..."
          style={{ width: "100%", minHeight: "80px", marginTop: "0.5rem" }}
        />

        <div style={{ marginTop: "0.5rem" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Speichern..." : "Absenden"}
          </button>
        </div>
      </form>

      <h4 style={{ marginTop: "1.5rem" }}>Alle Bewertungen</h4>
      {feedbackList.length === 0 ? (
        <p>Noch keine Bewertungen vorhanden.</p>
      ) : (
        <ul>
          {feedbackList.map((f, i) => (
            <li key={i}>
              <strong>{'★'.repeat(f.rating)}</strong> – {f.comment || <em>kein Kommentar</em>}
              <div style={{ fontSize: '0.85rem', color: '#666' }}>{new Date(f.created_at).toLocaleString('de-DE')}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
