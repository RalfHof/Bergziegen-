import { touren } from "@/data/touren";

interface PageProps {
  params: {
    id: string;
  };
}

export default function TourDetailPage({ params }: PageProps) {
  // Wichtig: params.id ist ein String – also in Zahl umwandeln!
  const tour = touren.find((t) => t.id === Number(params.id));

  if (!tour) {
    return <div>Tour nicht gefunden.</div>;
  }

  return (
    <div>
      <h1>{tour.name}</h1>
      <p>{tour.description}</p>
      <a href={tour.komootLink} target="_blank" rel="noopener noreferrer">
        Zur Komoot Tour
      </a>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {tour.images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Bild ${index + 1}`}
            style={{ width: "200px", borderRadius: "8px" }}
          />
        ))}
      </div>
    </div>
  );
}
