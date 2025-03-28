import { notFound } from "next/navigation";
import { touren } from "@/data/touren";

export default function TourDetails({ params }: { params: { id: string } }) {
  if (!params?.id) {
    return notFound();
  }

  const tour = touren.find((t) => t.id.toString() === params.id);

  if (!tour) {
    return notFound();
  }

  return (
    <div>
      <h1>{tour.name}</h1>
      <p>{tour.description}</p>
      <div>
        {tour.images.map((src, index) => (
          <img key={index} src={src} alt={`Bild ${index + 1}`} width="300" />
        ))}
      </div>
      <a href={tour.komootLink} target="_blank">Zur Komoot-Tour</a>
    </div>
  );
}

