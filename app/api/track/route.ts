import { NextRequest, NextResponse } from "next/server";

// In production, this would write to a database or analytics service
// For MVP, we log to console and could write to a JSON file
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  const productId = searchParams.get("productId");
  const persona = searchParams.get("persona");

  if (!url) {
    return NextResponse.json({ error: "Missing redirect URL" }, { status: 400 });
  }

  // Log the click event (OTB - Open to Buy tracking)
  const clickEvent = {
    timestamp: new Date().toISOString(),
    productId: productId || "unknown",
    persona: persona || "unknown",
    targetUrl: url,
    userAgent: request.headers.get("user-agent") || "unknown",
    referer: request.headers.get("referer") || "direct",
  };

  // Log to console for now (in production, send to analytics service)
  console.log("[OTB Click]", JSON.stringify(clickEvent));

  // Redirect to the affiliate URL
  return NextResponse.redirect(url);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, productId, persona, metadata } = body;

    // Log the analytics event
    const analyticsEvent = {
      timestamp: new Date().toISOString(),
      event: event || "unknown",
      productId: productId || "unknown",
      persona: persona || "unknown",
      metadata: metadata || {},
    };

    console.log("[Analytics]", JSON.stringify(analyticsEvent));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
