"use client";

import { useState, useEffect } from "react";

type FeedbackProps = {
  tourId: number;
};

export default function Feedback({ tourId }: FeedbackProps) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [savedFeedback, setSavedFeedback] = useState<{ rating: number; comment: string } | null>(null);

  // Beim Laden prüfen, ob Feedback schon gespeichert ist
  useEffect(() => {
    const stored = localStorage.getItem(`feedback-${tourId}`);
    if (stored) {
      setSavedFeedback(JSON.parse(stored));
    }
  }, [tourId]);

  const handleSave = () => {
    const feedback = { rating, comment };
    localStorage.setItem(`feedback-${tourId}`, JSON.stringify(feedback));
    setSavedFeedback(feedback);
    setRating(0);
    setComment("");
  };

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", background: "#fff", borderRadius: "12px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
      <h3>Dein Feedback</h3>

      {/* Sterne */}
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              cursor: "pointer",
              color: star <= (hover || rating) ? "gold" : "lightgray",
            }}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        ))}
      </div>

      {/* Kommentar */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Schreibe einen Kommentar..."
        style={{ width: "100%", minHeight: "80px", padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      <button
        onClick={handleSave}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          border: "none",
          background: "#0070f3",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Speichern
      </button>

      {savedFeedback && (
        <div style={{ marginTop: "1rem", background: "#f5f5f5", padding: "0.5rem 1rem", borderRadius: "8px" }}>
          <p>
            <strong>Deine Bewertung:</strong>{" "}
            {"★".repeat(savedFeedback.rating) + "☆".repeat(5 - savedFeedback.rating)}
          </p>
          <p>
            <strong>Kommentar:</strong> {savedFeedback.comment}
          </p>
        </div>
      )}
    </div>
  );
}
