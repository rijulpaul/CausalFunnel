// app/api/pages/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/pages`,
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: response.status },
    );
  }

  const data = await response.json();

  return NextResponse.json(data);
}
