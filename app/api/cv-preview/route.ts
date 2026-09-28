import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/cv-preview?url=<cloudinary-url>
 *
 * Server-side proxy that fetches the CV from Cloudinary (no CORS issues)
 * and streams it back to the browser with:
 *   Content-Disposition: inline; filename="Swajan_Cv.pdf"
 *
 * "inline" tells the browser to render/preview the PDF instead of
 * triggering an immediate download. The user can then Save As from the
 * browser PDF viewer and will see "Swajan_Cv.pdf" as the suggested name.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cvUrl = searchParams.get("url");

  if (!cvUrl) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  // Only allow Cloudinary URLs to prevent open-redirect / SSRF abuse
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(cvUrl);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!parsedUrl.hostname.endsWith("cloudinary.com")) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }

  try {
    const upstream = await fetch(cvUrl, { cache: "no-store" });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Failed to fetch CV from upstream" },
        { status: 502 }
      );
    }

    const contentType =
      upstream.headers.get("content-type") || "application/pdf";

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // "inline" → preview in browser; filename is used by the Save dialog
        "Content-Disposition": `inline; filename="Swajan_Cv.pdf"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[cv-preview] upstream fetch error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
