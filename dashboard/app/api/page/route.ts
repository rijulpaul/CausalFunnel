// app/api/page/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Extract searchParams from the incoming request URL
  const searchParams = request.nextUrl.searchParams;

  // Use .get('paramName') to read the passed parameter
  const pageURL = searchParams.get('page_url');

  const response = await fetch(`${process.env.BACKEND_URL}/api/heatmap?page_url=${pageURL}`)

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: response.status },
    );
  }

  const data = await response.json();

  return NextResponse.json(data);
}
