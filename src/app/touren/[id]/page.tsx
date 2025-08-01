"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { touren } from "@/data/touren";
import styles from "./page.module.css";

// Typ ableiten aus touren-Array
type TourType = typeof touren[0];

export default function Page({ params }: { params: { id: string } }) {
  const [tour, setTour] = useState<TourType | null>(null);
  const [zoomedImage, setZoomedImage] = useState<number | null>(null);

  useEffect(() => {
    const id = parseInt(params.id);
    const foundTour = touren.find((t) => t.id === id) || null;
    setTour(foundTour);
  }, [params.id]);

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
      <h1 className={styles.title}>{tour.name}</h1>
      <p className={styles.description}>{tour.description}</p>

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

      <div className={styles.gallery}>
        {tour.images.map((src: string, index: number) => (
          <Image
            key={index}
            src={src}
            alt={`${tour.name} Bild ${index + 1}`} // ✅ Korrektes Template Literal
            width={zoomedImage === index ? 600 : 300}
            height={zoomedImage === index ? 400 : 200}
            style={{
              borderRadius: "12px",
              objectFit: "cover",
              cursor: "pointer",
              transition: "width 0.3s ease, height 0.3s ease",
              margin: "0.5rem",
            }}
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
