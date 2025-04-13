// src/app/touren/page.tsx
"use client";
import Link from "next/link";
import { touren } from "@/data/touren";

export default function TourenPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Alle Touren</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
        }}
      >
        {touren.map((tour) => (
          <div
            key={tour.id}
            style={{
              width: "300px",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              {tour.name}
            </h2>
            <Link href={`/touren/${tour.id}`}>
              <img
                src={tour.images[0]}
                alt={`Vorschau für ${tour.name}`}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

