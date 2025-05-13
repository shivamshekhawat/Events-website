import { notFound } from "next/navigation"
import Image from "next/image"
import { Calendar, Clock, MapPin, Tag } from "lucide-react"
import { getEventById } from "@/lib/scraper"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"

// Revalidate the page every hour
export const revalidate = 3600

interface EventPageProps {
  params: {
    id: string
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={event.imageUrl || "/placeholder.svg?height=400&width=600"}
                alt={event.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{event.title}</h1>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-5 w-5" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-5 w-5" />
                  <span>
                    {event.venue}, {event.address}
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Tag className="mr-2 h-5 w-5" />
                  <span>{event.category}</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold">About This Event</h2>
                <p className="mt-2 text-muted-foreground">{event.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Price</h2>
                <p className="mt-2 text-muted-foreground">{event.price}</p>
              </div>

              <div className="pt-4">
                <EmailModalButton event={event} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Client component for the email modal button
function EmailModalButton({ event }: { event: any }) {
  return (
    <>
      <form>
        <Button
          className="w-full md:w-auto"
          formAction={async () => {
            "use client"
            document.getElementById("email-modal-trigger")?.click()
          }}
        >
          GET TICKETS
        </Button>
      </form>
      <div className="hidden">
        <button
          id="email-modal-trigger"
          data-event-id={event.id}
          data-event-title={event.title}
          data-ticket-url={event.ticketUrl}
        />
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', () => {
              const trigger = document.getElementById('email-modal-trigger');
              if (trigger) {
                trigger.addEventListener('click', () => {
                  const event = new CustomEvent('open-email-modal', {
                    detail: {
                      eventId: trigger.dataset.eventId,
                      eventTitle: trigger.dataset.eventTitle,
                      ticketUrl: trigger.dataset.ticketUrl
                    }
                  });
                  window.dispatchEvent(event);
                });
              }
            });
          `,
        }}
      />
    </>
  )
}
