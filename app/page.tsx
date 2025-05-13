import { Suspense } from "react"
import { getEvents, scrapeAllEvents } from "@/lib/scraper"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EventCard from "@/components/event-card"
import { Button } from "@/components/ui/button"

// Revalidate the page every hour
export const revalidate = 3600

async function EventsGrid() {
  try {
    // Get events from Redis or scrape if needed
    const { events, lastUpdated } = await getEvents()

    // Format the last updated time
    const lastUpdatedTime = new Date(lastUpdated).toLocaleString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdatedTime}</p>
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-10 text-center">
            <h3 className="text-lg font-semibold">No events found</h3>
            <p className="text-sm text-muted-foreground">We couldn't find any events. Please check back later.</p>
            <form
              action={async () => {
                "use server"
                await scrapeAllEvents()
              }}
            >
              <Button type="submit">Refresh Events</Button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error in EventsGrid:", error)
    return (
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-semibold">Error loading events</h3>
        <p className="text-sm text-muted-foreground">
          We encountered an error while loading events. Please try again later.
        </p>
        <form
          action={async () => {
            "use server"
            await scrapeAllEvents()
          }}
        >
          <Button type="submit">Retry</Button>
        </form>
      </div>
    )
  }
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-muted/50 to-background py-12 md:py-24">
          <div className="container space-y-6 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Discover Sydney's Best Events
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Find concerts, festivals, exhibitions, and more happening in Sydney, Australia.
            </p>
          </div>
        </section>

        <section className="container py-12">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            }
          >
            <EventsGrid />
          </Suspense>
        </section>
      </main>
      <Footer />
    </div>
  )
}
