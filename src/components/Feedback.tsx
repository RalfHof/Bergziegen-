"use client";

import { useState, useEffect } from "react";
import { getAverageRating, FeedbackEntry } from "@/utils/feedbackUtils";

type FeedbackProps = {
  tourId: number;
};

export default function Feedback({ tourId }: FeedbackProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Feedbacks laden
  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/feedback?tourId=${tourId}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data: FeedbackEntry[] = await res.json();
        setFeedbacks(data);
        const avg = await getAverageRating(tourId);
        setAvgRating(avg);
      }
    } catch (err) {
      console.error("Fehler beim Laden der Feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, [tourId]);

  // Feedback absenden
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating < 1) {
      alert("Bitte gib mindestens 1 Stern.");
      return;
    }

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tourId, rating, comment }),
      });

      if (!res.ok) {
        throw new Error("Fehler beim Speichern des Feedbacks");
      }

      setRating(0);
      setComment("");
      await loadFeedbacks();
    } catch (err) {
      console.error(err);
      alert("Feedback konnte nicht gespeichert werden.");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>⭐ Feedback</h2>

      {/* Durchschnitt */}
      {avgRating > 0 && (
        <p>
          Durchschnitt: <strong>⭐ {avgRating.toFixed(1)}</strong>
        </p>
      )}

      {/* Formular */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                fontSize: "1.5rem",
                color: star <= rating ? "gold" : "gray",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Kommentar schreiben..."
          style={{ width: "100%", minHeight: "80px", marginTop: "0.5rem" }}
        />

        <button
          type="submit"
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Abschicken
        </button>
      </form>

      {/* Liste aller Feedbacks */}
      <h3>Alle Bewertungen</h3>
      {loading ? (
        <p>Lade Feedback...</p>
      ) : feedbacks.length === 0 ? (
        <p>Noch keine Bewertungen vorhanden.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {feedbacks.map((f, idx) => (
            <li
              key={idx}
              style={{
                borderBottom: "1px solid #ccc",
                padding: "0.5rem 0",
              }}
            >
              <p>
                {Array.from({ length: f.rating }).map(() => "⭐").join("")}
              </p>
              {f.comment && <p>{f.comment}</p>}
              <small>
                {f.created_at
                  ? new Date(f.created_at).toLocaleString("de-DE")
                  : ""}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
