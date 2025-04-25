// src/types/message.ts (oder ähnlicher Pfad)
export type Message = {
        id: number; // Oder string, je nachdem wie die ID in deiner DB ist
        created_at: string;
        text: string;
        user_email: string | null; // Muss string | null sein
        user_id: string; // Muss string sein
    };