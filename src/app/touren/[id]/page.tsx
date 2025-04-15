"use client"; // Wichtig, da wir useState und Event-Handler verwenden

import { useState } from 'react'; // Import useState
import { notFound } from "next/navigation";
import Image from "next/image";
import { touren } from "@/data/touren";
import styles from "./page.module.css";

export default function Page({ params }: { params: { id: string } }) {
  const tourId = parseInt(params.id); // Direkter Zugriff auf params.id
  const tour = touren.find((t) => t.id === tourId);
  const [zoomedImage, setZoomedImage] = useState<number | null>(null); // State für das gezoomte Bild

  if (!tour) {
    notFound();
  }

  const handleImageClick = (index: number) => {
    setZoomedImage(zoomedImage === index ? null : index); // Toggle Zoom
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{tour.name}</h1>
      <p className={styles.description}>{tour.description}</p>
      <a
        href={tour.komootLink}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.komootLink}
      >
        Zur Komoot-Tour
      </a>

      <div className={styles.gallery}>
        {tour.images.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`${tour.name} Bild ${index + 1}`}
            width={zoomedImage === index ? 600 : 300} // Dynamische Breite
            height={zoomedImage === index ? 400 : 200} // Dynamische Höhe
            style={{
              borderRadius: "12px",
              objectFit: "cover",
              cursor: "pointer",
              transition: "width 0.3s ease, height 0.3s ease", // Sanfte Animation
            }}
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>
    </div>
  );
}