import { NextResponse } from "next/server";

const API_URL = process.env.BACKEND_URL;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ session: string }> }
) {
  try {
    const { session } = await params;

    const response = await fetch(
      `${API_URL}/api/sessions/${session}/events`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch session events" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching session events:", error);

    return NextResponse.json(
      { error: "Failed to fetch session events" },
      { status: 500 }
    );
  }
}
