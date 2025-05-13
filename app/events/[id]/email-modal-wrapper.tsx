"use client"

import { useEffect, useState } from "react"
import EmailModal from "@/components/email-modal"

export default function EmailModalWrapper() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [eventData, setEventData] = useState({
    eventId: "",
    eventTitle: "",
    ticketUrl: "",
  })

  useEffect(() => {
    const handleOpenModal = (e: any) => {
      setEventData({
        eventId: e.detail.eventId,
        eventTitle: e.detail.eventTitle,
        ticketUrl: e.detail.ticketUrl,
      })
      setIsModalOpen(true)
    }

    window.addEventListener("open-email-modal", handleOpenModal)

    return () => {
      window.removeEventListener("open-email-modal", handleOpenModal)
    }
  }, [])

  return (
    <EmailModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      eventId={eventData.eventId}
      eventTitle={eventData.eventTitle}
      ticketUrl={eventData.ticketUrl}
    />
  )
}
