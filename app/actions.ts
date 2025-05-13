"use server"

import type { EmailSubscription } from "@/types/event"
import redis from "@/lib/redis"
import { z } from "zod"

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  eventId: z.string().min(1, "Event ID is required"),
})

export async function subscribeToEvent(
  formData: FormData,
): Promise<{ success: boolean; message: string; ticketUrl?: string }> {
  try {
    const email = formData.get("email") as string
    const eventId = formData.get("eventId") as string
    const ticketUrl = formData.get("ticketUrl") as string

    // Validate input
    const result = emailSchema.safeParse({ email, eventId })
    if (!result.success) {
      return { success: false, message: "Invalid email or event ID" }
    }

    // Create subscription object
    const subscription: EmailSubscription = {
      email,
      eventId,
      timestamp: Date.now(),
    }

    try {
      // Store in Redis
      const key = `sydney:subscriptions:${eventId}`
      await redis.lpush(key, JSON.stringify(subscription))

      // Also store in a list of all emails for marketing purposes
      await redis.sadd("sydney:all_emails", email)
    } catch (redisError) {
      console.error("Redis error in subscribeToEvent:", redisError)
      // Continue execution even if Redis storage fails
    }

    return {
      success: true,
      message: "Thank you for subscribing! Redirecting to ticket page...",
      ticketUrl,
    }
  } catch (error) {
    console.error("Error subscribing to event:", error)
    return { success: false, message: "An error occurred. Please try again." }
  }
}
