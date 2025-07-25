
import { NextResponse } from 'next/server';

export async function GET() {
  const adsTxtContent = `google.com, pub-9124896176133484, DIRECT, f08c47fec0942fa0`;
  
  return new NextResponse(adsTxtContent, {
    headers: {
      'Content-Type': 'text/plain; charset=UTF-8',
    },
  });
}
