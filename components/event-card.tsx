"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { Event } from "@/types/event"
import EmailModal from "./email-modal"

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={event.imageUrl || "/placeholder.svg?height=400&width=600"}
              alt={event.title}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="line-clamp-1 text-xl font-bold">
              <Link href={`/events/${event.id}`} className="hover:underline">
                {event.title}
              </Link>
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              <span>{event.venue}</span>
            </div>
            <p className="line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full" onClick={() => setIsModalOpen(true)}>
            GET TICKETS
          </Button>
        </CardFooter>
      </Card>

      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventId={event.id}
        eventTitle={event.title}
        ticketUrl={event.ticketUrl}
      />
    </>
  )
}
