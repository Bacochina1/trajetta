import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'GOOGLE_CLIENT_ID não configurado no servidor.' },
      { status: 500 }
    );
  }

  // Determine origin for redirect
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const redirectUri = `${protocol}://${host}/api/auth/callback/google`;

  // Preserve returnUrl and UTM parameters
  const returnUrl = request.nextUrl.searchParams.get('returnUrl') || '/app';
  const stateData = {
    returnUrl,
    utm_source: request.nextUrl.searchParams.get('utm_source') || '',
    utm_campaign: request.nextUrl.searchParams.get('utm_campaign') || '',
  };
  const state = Buffer.from(JSON.stringify(stateData)).toString('base64url');

  const scope = encodeURIComponent('openid email profile');
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;

  return NextResponse.redirect(googleAuthUrl);
}
