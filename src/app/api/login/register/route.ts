import { NextResponse } from 'next/server';

export async function POST() {
  // Registrierung ohne echte Speicherung
  return NextResponse.json({ success: true });
}
