// src/app/touren/[id]/page.tsx
import { touren } from "@/data/touren";
import "@/styles/detail.css";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const tourId = parseInt(params.id);
  const tour = touren.find((t) => t.id === tourId);

  if (!tour) {
    return <div>Tour nicht gefunden</div>;
  }

  return (
    <div className="detail-container">
      <h1 className="detail-title">{tour.name}</h1>
      <p className="detail-description">{tour.description}</p>

      <div className="image-gallery">
        {tour.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Bild ${index + 1} der Tour ${tour.name}`}
            className="detail-image"
          />
        ))}
      </div>

      <a
        href={tour.komootLink}
        target="_blank"
        rel="noopener noreferrer"
        className="komoot-link"
      >
        Zur Komoot-Tour
      </a>
    </div>
  );
}
