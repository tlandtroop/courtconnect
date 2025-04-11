import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius") || "5000";

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;
    if (!apiKey) {
      console.error("Google Maps API key is not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=sports+courts&location=${lat},${lng}&radius=${radius}&key=${apiKey}`;
    console.log("Making request to Google Places API:", url);

    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        "Google Places API response not ok:",
        response.status,
        response.statusText
      );
      return NextResponse.json(
        { error: "Failed to fetch from Google Places API" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.status !== "OK") {
      console.error(
        "Google Places API error:",
        data.status,
        data.error_message
      );
      return NextResponse.json(
        { error: data.error_message || "No results found" },
        { status: 404 }
      );
    }

    // Log the first result's full details
    if (data.results && data.results.length > 0) {
      console.log(
        "First result details:",
        JSON.stringify(data.results[0], null, 2)
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching courts:", error);
    return NextResponse.json(
      { error: "Failed to fetch courts" },
      { status: 500 }
    );
  }
}
