import { tourenData } from "@/data/touren";
import Image from "next/image";

type Params = {
  params: {
    id: string;
  };
};

export default function TourDetailPage({ params }: Params) {
  const tour = tourenData.find((t) => t.id === params.id);

  if (!tour) {
    return <div>Tour nicht gefunden</div>;
  }

  return (
    <div>
      <h1>{tour.name}</h1>
      <p>{tour.beschreibung}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {tour.bilder.map((bild, index) => (
          <Image
            key={index}
            src={bild}
            alt={`Bild ${index + 1} der Tour ${tour.name}`}
            width={300}
            height={200}
          />
        ))}
      </div>
      <p>
        <a href={tour.komootLink} target="_blank" rel="noopener noreferrer">
          Zur Komoot-Tour
        </a>
      </p>
    </div>
  );
}
