import { tourenData } from "@/data/touren";
import Image from "next/image";

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const tour = tourenData.find((t) => t.id === params.id);

  if (!tour) {
    return <div>Tour nicht gefunden.</div>;
  }

  return (
    <div>
      <h1>{tour.name}</h1>
      <p>{tour.beschreibung}</p>
      <a href={tour.komootLink} target="_blank" rel="noopener noreferrer">
        Zur Komoot-Tour
      </a>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {tour.bilder.map((bild: string, index: number) => (
          <Image
            key={index}
            src={bild}
            alt={`Bild ${index + 1} von ${tour.name}`}
            width={300}
            height={200}
          />
        ))}
      </div>
    </div>
  );
}

