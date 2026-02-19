import { NextRequest, NextResponse } from 'next/server'

/**
 * DEPRECATED: This endpoint has been merged into /api/cms/members/categories
 * 
 * The heading (title and subtitle) is now part of the categories section.
 * All heading data should be sent/fetched through the categories endpoint.
 * 
 * Legacy requests will be redirected to the categories endpoint.
 */

export async function POST(request: NextRequest) {
  // Redirect POST requests to categories endpoint
  const body = await request.json()
  
  return fetch(new URL('/api/cms/members/categories', request.url), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      heading: body,
    }),
  }).then(res => res.json())
}

export async function GET() {
  // Redirect GET requests to categories endpoint and return only heading
  return fetch(new URL('/api/cms/members/categories', process.env.NEXTAUTH_URL || 'http://localhost:3000'), {
    method: 'GET',
  })
    .then(res => res.json())
    .then(data => {
      return NextResponse.json(data.heading || {
        subtitleEn: 'OUR COMMUNITY',
        subtitleId: 'KOMUNITAS KAMI',
        titleEn: 'ADIGSI Cyber Security Members',
        titleId: 'Anggota Cyber Security ADIGSI',
      })
    })
}
