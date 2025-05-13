import { type NextRequest, NextResponse } from "next/server"
import { scrapeAllEvents } from "@/lib/scraper"

export async function GET(request: NextRequest) {
  try {
    // Check for a secret key to prevent unauthorized access
    const authHeader = request.headers.get("authorization")
    if (!authHeader || authHeader !== `Bearer ${process.env.SCRAPER_SECRET_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const events = await scrapeAllEvents()
    return NextResponse.json({
      success: true,
      message: `Successfully scraped ${events.length} events`,
    })
  } catch (error) {
    console.error("Error in scrape API route:", error)
    return NextResponse.json({ error: "Failed to scrape events" }, { status: 500 })
  }
}
