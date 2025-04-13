import { notFound } from "next/navigation";
import Image from "next/image";
import { touren } from "@/data/touren";

type PageProps = {
  params: { id: string };
};

export default async function Page({ params }: PageProps) {
  // Wandle die id in eine Zahl um
  const tourId = parseInt(params.id);

  // Finde die passende Tour
  const tour = touren.find((t) => t.id === tourId);

  // Wenn keine Tour gefunden wurde → 404
  if (!tour) {
    notFound();
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{tour.name}</h1>
      <p style={{ marginBottom: "1rem" }}>{tour.description}</p>
      <a
        href={tour.komootLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "blue",
          textDecoration: "underline",
          marginBottom: "2rem",
          display: "inline-block",
        }}
      >
        Zur Komoot-Tour
      </a>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        {tour.images.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`${tour.name} Bild ${index + 1}`}
            width={300}
            height={200}
            style={{ borderRadius: "12px", objectFit: "cover" }}
          />
        ))}
      </div>
    </div>
  );
}
