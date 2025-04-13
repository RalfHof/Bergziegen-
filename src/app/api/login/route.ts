import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Hier könntest du echte Authentifizierung einbauen
  if (email === 'test@bergziegen.de' && password === '1234') {
    const response = NextResponse.json({ success: true });
    response.cookies.set('auth', 'true', { path: '/' });
    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
