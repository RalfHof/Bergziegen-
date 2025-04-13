import { notFound } from "next/navigation";
import Image from "next/image";
import { touren } from "@/data/touren";

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  return touren.map((tour) => ({
    id: tour.id.toString(),
  }));
}

export default async function Page({ params }: Props) {
  const tourId = parseInt(params.id);
  const tour = touren.find((t) => t.id === tourId);

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
