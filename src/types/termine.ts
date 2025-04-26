// src/types/termine.ts

// Dies definiert die Struktur eines Termin-Objekts, wie es aus der Supabase DB kommt.
export interface Termin {
    id: number; // Passt zu int8/bigint in der DB
    created_at: string; // Passt zu timestampz
    user_id: string; // Passt zu uuid (Die ID des Erstellers)
    date: string; // Passt zu date (Format YYYY-MM-DD)
    tour_title: string; // Passt zu text
    difficulty: string | null; // Passt zu text, kann null sein
    status: string | null; // Passt zu text, kann null sein ('aktiv', 'abgesagt')
}

// Optional: Falls du eine erweiterte Version für UI-Zwecke brauchst,
// z.B. mit User E-Mail (wenn per Join geholt)
// export interface TerminUI extends Termin {
//     user_email?: string | null;
// }