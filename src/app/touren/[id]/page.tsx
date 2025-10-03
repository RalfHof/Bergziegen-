// src/app/touren/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { touren } from "@/data/touren";
import styles from "./page.module.css";
import Feedback from "@/components/Feedback";
import { getAverageRating } from "@/utils/feedbackUtils";

type TourType = typeof touren[number];

export default function Page() {
  const params = useParams();
  const [tour, setTour] = useState<TourType | null>(null);
  const [zoomedImage, setZoomedImage] = useState<number | null>(null);
  const [avgRating, setAvgRating] = useState<number | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    const id = parseInt(params.id as string, 10);
    const foundTour = touren.find((t) => t.id === id) || null;
    setTour(foundTour);

    if (foundTour) {
      getAverageRating(foundTour.id).then((r) => setAvgRating(r));
    }
  }, [params?.id]);

  if (!tour) {
    return (
      <div className={styles.container}>
        <h1>Tour nicht gefunden</h1>
        <p>Es wurde keine passende Tour für die angegebene ID gefunden.</p>
      </div>
    );
  }

  const handleImageClick = (index: number) => {
    setZoomedImage(zoomedImage === index ? null : index);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {tour.name}{" "}
        {avgRating !== null && (
          <span className={styles.avgRating}>⭐ {avgRating.toFixed(1)}</span>
        )}
      </h1>

      <p className={styles.description}>{tour.description}</p>

      <div className={styles.tourInfo}>
        {tour.distance && (
          <p>
            <strong>Distanz:</strong> {tour.distance}
          </p>
        )}
        {tour.duration && (
          <p>
            <strong>Dauer:</strong> {tour.duration}
          </p>
        )}
        {tour.difficulty && (
          <p>
            <strong>Schwierigkeit:</strong> {tour.difficulty}
          </p>
        )}
        {tour.ascent && (
          <p>
            <strong>Aufstieg:</strong> {tour.ascent}
          </p>
        )}
      </div>

      <div className={styles.links}>
        <a
          href={tour.komootLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.komootLink}
        >
          Zur Komoot-Tour
        </a>{" "}
        |{" "}
        <a
          href={tour.outdooractiveLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.komootLink}
        >
          Outdooractive öffnen
        </a>
      </div>

      {/* Galerie mit Bildern */}
      <div className={styles.gallery}>
        {tour.images.map((src: string, index: number) => (
          <Image
            key={index}
            src={src}
            alt={`${tour.name} Bild ${index + 1}`}
            width={zoomedImage === index ? 800 : 400}
            height={zoomedImage === index ? 600 : 300}
            style={{
              borderRadius: "12px",
              objectFit: "contain",
              backgroundColor: "#000",
              cursor: "pointer",
              transition: "width 0.3s ease, height 0.3s ease",
              margin: "0.5rem",
            }}
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>

      {/* Video falls vorhanden */}
      {tour.video && (
        <div style={{ marginTop: "2rem" }}>
          <h2>🎥 Video zur Tour</h2>
          <video
            controls
            style={{
              maxWidth: "100%",
              borderRadius: "12px",
              marginTop: "1rem",
            }}
          >
            <source src={tour.video} type="video/mp4" />
            Dein Browser unterstützt kein HTML5-Video.
          </video>
        </div>
      )}

      <Feedback tourId={tour.id} onNewRating={(avg) => setAvgRating(avg)} />
    </div>
  );
}
