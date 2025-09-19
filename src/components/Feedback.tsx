"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface FeedbackProps {
  tourId: number;
  onNewRating?: (newAverage: number) => void; // Callback an Eltern-Komponente
}

// 🎯 Eigener Typ für ein Feedback-Eintrag
interface FeedbackEntry {
  tour_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export default function Feedback({ tourId, onNewRating }: FeedbackProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>([]);

  // Feedbacks für diese Tour laden
  useEffect(() => {
    const loadFeedbacks = async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("tour_id", tourId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Typecast, damit TS zufrieden ist
        setFeedbackList(data as FeedbackEntry[]);
      }
    };

    loadFeedbacks();
  }, [tourId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("feedback").insert([
      {
        tour_id: tourId,
        rating,
        comment,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Fehler beim Speichern: " + error.message);
      return;
    }

    // Lokale Liste aktualisieren
    const newEntry: FeedbackEntry = {
      tour_id: tourId,
      rating,
      comment,
      created_at: new Date().toISOString(),
    };
    const updatedFeedbacks = [newEntry, ...feedbackList];
    setFeedbackList(updatedFeedbacks);

    // Durchschnitt neu berechnen
    const sum = updatedFeedbacks.reduce((acc, f) => acc + f.rating, 0);
    const avg = sum / updatedFeedbacks.length;

    if (onNewRating) {
      onNewRating(avg); // Eltern-Seite informieren
    }

    // Formular zurücksetzen
    setRating(0);
    setComment("");
  };

  return (
    <div style={{ marginTop: "2rem", width: "100%", maxWidth: "600px" }}>
      <h3>Bewertung abgeben</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Sterne:
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={0}>Bitte wählen</option>
            <option value={1}>⭐ 1</option>
            <option value={2}>⭐ 2</option>
            <option value={3}>⭐ 3</option>
            <option value={4}>⭐ 4</option>
            <option value={5}>⭐ 5</option>
          </select>
        </label>
        <br />
        <label>
          Kommentar:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: "100%", minHeight: "80px" }}
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Speichern..." : "Absenden"}
        </button>
      </form>

      <h4 style={{ marginTop: "1.5rem" }}>Alle Bewertungen</h4>
      {feedbackList.length === 0 ? (
        <p>Noch keine Bewertungen vorhanden.</p>
      ) : (
        <ul>
          {feedbackList.map((f, i) => (
            <li key={i}>
              <strong>{f.rating}⭐</strong> – {f.comment}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
