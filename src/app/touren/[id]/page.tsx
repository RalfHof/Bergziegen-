import { notFound } from "next/navigation";
import { touren } from "@/data/touren";

// Wichtig: Damit Next.js params korrekt behandelt
export const dynamic = "force-dynamic";

export default function TourDetails({ params }: { params: { id: string } }) {
  const tour = touren.find((t) => t.id.toString() === params.id);

  if (!tour) {
    return notFound();
  }

  return (
    <div>
      <h1>{tour.name}</h1>
      <p>{tour.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {tour.images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Bild ${index + 1}`}
            width="300"
            style={{ borderRadius: "10px" }}
          />
        ))}
      </div>
      <p style={{ marginTop: "1rem" }}>
        <a
          href={tour.komootLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "green",
            textDecoration: "underline",
            fontWeight: "bold",
          }}
        >
          Zur Komoot-Tour
        </a>
      </p>
    </div>
  );
}
