"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { subscribeToEvent } from "@/app/actions"

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  eventTitle: string
  ticketUrl: string
}

export default function EmailModal({ isOpen, onClose, eventId, eventTitle, ticketUrl }: EmailModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setMessage("")

    try {
      const result = await subscribeToEvent(formData)

      if (result.success) {
        setIsSuccess(true)
        setMessage(result.message)

        // Redirect after 2 seconds
        setTimeout(() => {
          window.open(ticketUrl, "_blank")
          onClose()
        }, 2000)
      } else {
        setMessage(result.message)
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get Tickets for {eventTitle}</DialogTitle>
          <DialogDescription>Enter your email to continue to the ticket page.</DialogDescription>
        </DialogHeader>
        <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>

        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="eventId" value={eventId} />
          <input type="hidden" name="ticketUrl" value={ticketUrl} />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="marketing" name="marketing" defaultChecked />
            <Label htmlFor="marketing" className="text-sm">
              I want to receive emails about events in Sydney
            </Label>
          </div>

          {message && <p className={`text-sm ${isSuccess ? "text-green-600" : "text-red-600"}`}>{message}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Continue to Tickets"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
