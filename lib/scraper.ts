import * as cheerio from "cheerio"
import { v4 as uuidv4 } from "uuid"
import type { Event } from "@/types/event"
import redis from "./redis"

// Websites to scrape
const SCRAPE_URLS = [
  "https://www.timeout.com/sydney/things-to-do/things-to-do-in-sydney-today",
  "https://whatson.cityofsydney.nsw.gov.au/events",
  "https://www.eventbrite.com.au/d/australia--sydney/events/",
]

// Function to scrape events from timeout.com
async function scrapeTimeoutSydney(): Promise<Event[]> {
  try {
    const response = await fetch(SCRAPE_URLS[0])
    const html = await response.text()
    const $ = cheerio.load(html)
    const events: Event[] = []

    $(".card-container article").each((_, element) => {
      const title = $(element).find("h3").text().trim()
      const description = $(element).find(".card-description").text().trim()
      const imageUrl = $(element).find("img").attr("src") || "/placeholder.svg?height=400&width=600"
      const dateText = $(element).find(".date").text().trim()
      const venueText = $(element).find(".venue").text().trim()

      if (title) {
        events.push({
          id: uuidv4(),
          title,
          description: description || "No description available",
          date: dateText || "Date TBA",
          time: "Time TBA",
          venue: venueText || "Venue TBA",
          address: "Sydney, Australia",
          imageUrl,
          ticketUrl: "https://www.timeout.com/sydney",
          price: "Price varies",
          category: "Entertainment",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })
      }
    })

    return events
  } catch (error) {
    console.error("Error scraping Timeout Sydney:", error)
    return []
  }
}

// Function to scrape events from whatson.cityofsydney
async function scrapeCityOfSydney(): Promise<Event[]> {
  try {
    const response = await fetch(SCRAPE_URLS[1])
    const html = await response.text()
    const $ = cheerio.load(html)
    const events: Event[] = []

    $(".event-card").each((_, element) => {
      const title = $(element).find(".event-card__title").text().trim()
      const description = $(element).find(".event-card__description").text().trim()
      const imageUrl = $(element).find("img").attr("src") || "/placeholder.svg?height=400&width=600"
      const dateText = $(element).find(".event-card__date").text().trim()
      const venueText = $(element).find(".event-card__venue").text().trim()
      const eventUrl = $(element).find("a").attr("href") || ""

      if (title) {
        events.push({
          id: uuidv4(),
          title,
          description: description || "No description available",
          date: dateText || "Date TBA",
          time: "Time TBA",
          venue: venueText || "Venue TBA",
          address: "Sydney, Australia",
          imageUrl,
          ticketUrl: eventUrl.startsWith("http") ? eventUrl : `https://whatson.cityofsydney.nsw.gov.au${eventUrl}`,
          price: "Price varies",
          category: "Entertainment",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })
      }
    })

    return events
  } catch (error) {
    console.error("Error scraping City of Sydney:", error)
    return []
  }
}

// Function to scrape events from eventbrite
async function scrapeEventbrite(): Promise<Event[]> {
  try {
    const response = await fetch(SCRAPE_URLS[2])
    const html = await response.text()
    const $ = cheerio.load(html)
    const events: Event[] = []

    $(".search-event-card-square").each((_, element) => {
      const title = $(element).find(".event-card__title").text().trim()
      const dateText = $(element).find(".event-card__date").text().trim()
      const venueText = $(element).find(".event-card__venue").text().trim()
      const imageUrl = $(element).find("img").attr("src") || "/placeholder.svg?height=400&width=600"
      const eventUrl = $(element).find("a").attr("href") || ""

      if (title) {
        events.push({
          id: uuidv4(),
          title,
          description: "Check event details on Eventbrite",
          date: dateText || "Date TBA",
          time: "Time TBA",
          venue: venueText || "Venue TBA",
          address: "Sydney, Australia",
          imageUrl,
          ticketUrl: eventUrl,
          price: "Price varies",
          category: "Entertainment",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })
      }
    })

    return events
  } catch (error) {
    console.error("Error scraping Eventbrite:", error)
    return []
  }
}

// Main function to scrape all sources and store in Redis
export async function scrapeAllEvents(): Promise<Event[]> {
  try {
    // Scrape events from all sources
    const [timeoutEvents, cityEvents, eventbriteEvents] = await Promise.all([
      scrapeTimeoutSydney(),
      scrapeCityOfSydney(),
      scrapeEventbrite(),
    ])

    // Combine all events
    const allEvents = [...timeoutEvents, ...cityEvents, ...eventbriteEvents]

    // If no events were scraped, generate some sample events
    const events = allEvents.length > 0 ? allEvents : generateSampleEvents()

    // Store in Redis
    try {
      // Make sure we're storing a JSON string, not an object
      const eventsJson = JSON.stringify(events)
      await redis.set("sydney:events", eventsJson)
      await redis.set("sydney:events:lastUpdated", Date.now())
    } catch (redisError) {
      console.error("Error storing events in Redis:", redisError)
      // Continue execution even if Redis storage fails
    }

    return events
  } catch (error) {
    console.error("Error scraping events:", error)
    return generateSampleEvents()
  }
}

// Function to generate sample events when scraping fails
function generateSampleEvents(): Event[] {
  const now = Date.now()
  return [
    {
      id: uuidv4(),
      title: "Sydney Opera House Tour",
      description: "Experience the iconic Sydney Opera House with a guided tour of this architectural masterpiece.",
      date: "Every day",
      time: "10:00 AM - 4:00 PM",
      venue: "Sydney Opera House",
      address: "Bennelong Point, Sydney NSW 2000",
      imageUrl: "/placeholder.svg?height=400&width=600",
      ticketUrl: "https://www.sydneyoperahouse.com",
      price: "$42",
      category: "Tours",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: "Bondi Beach Festival",
      description: "Annual festival celebrating beach culture with music, food, and activities for all ages.",
      date: "Saturday & Sunday",
      time: "9:00 AM - 6:00 PM",
      venue: "Bondi Beach",
      address: "Queen Elizabeth Dr, Bondi Beach NSW 2026",
      imageUrl: "/placeholder.svg?height=400&width=600",
      ticketUrl: "https://www.bondifestival.com.au",
      price: "Free",
      category: "Festival",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: "Sydney Harbour Bridge Climb",
      description: "Climb to the summit of the Sydney Harbour Bridge for breathtaking views of the city.",
      date: "Daily",
      time: "Various times",
      venue: "Sydney Harbour Bridge",
      address: "3 Cumberland St, The Rocks NSW 2000",
      imageUrl: "/placeholder.svg?height=400&width=600",
      ticketUrl: "https://www.bridgeclimb.com",
      price: "$168 - $403",
      category: "Adventure",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: "Royal Botanic Garden Walk",
      description: "Guided tour of Australia's oldest botanic garden featuring native and exotic plants.",
      date: "Weekdays",
      time: "10:30 AM - 12:00 PM",
      venue: "Royal Botanic Garden",
      address: "Mrs Macquaries Rd, Sydney NSW 2000",
      imageUrl: "/placeholder.svg?height=400&width=600",
      ticketUrl: "https://www.rbgsyd.nsw.gov.au",
      price: "$15",
      category: "Nature",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: "Taronga Zoo Sydney",
      description: "Visit Australia's leading zoological park featuring over 4,000 animals from around the world.",
      date: "Open daily",
      time: "9:30 AM - 5:00 PM",
      venue: "Taronga Zoo",
      address: "Bradleys Head Rd, Mosman NSW 2088",
      imageUrl: "/placeholder.svg?height=400&width=600",
      ticketUrl: "https://taronga.org.au/sydney-zoo",
      price: "$44.10 - $49",
      category: "Family",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: "Sydney Fish Market Tour",
      description: "Behind-the-scenes tour of the largest working fish market in the Southern Hemisphere.",
      date: "Mondays, Thursdays, and Fridays",
      time: "6:40 AM - 8:15 AM",
      venue: "Sydney Fish Market",
      address: "Bank St & Pyrmont Bridge Road, Sydney NSW 2009",
      imageUrl: "/placeholder.svg?height=400&width=600",
      ticketUrl: "https://www.sydneyfishmarket.com.au",
      price: "$35",
      category: "Food & Drink",
      createdAt: now,
      updatedAt: now,
    },
  ]
}

// Function to get events from Redis
export async function getEvents(): Promise<{ events: Event[]; lastUpdated: number }> {
  try {
    // Get events from Redis
    let events: Event[] = []
    let lastUpdated = 0

    try {
      const eventsData = await redis.get("sydney:events")
      lastUpdated = (await redis.get<number>("sydney:events:lastUpdated")) || 0

      // Parse events if available and it's a string
      if (eventsData) {
        // Check if the data is already an object or a string that needs parsing
        if (typeof eventsData === "string") {
          try {
            events = JSON.parse(eventsData)
          } catch (parseError) {
            console.error("Error parsing JSON from Redis:", parseError)
          }
        } else if (Array.isArray(eventsData)) {
          // If it's already an array, use it directly
          events = eventsData
        }
      }
    } catch (redisError) {
      console.error("Error fetching from Redis:", redisError)
    }

    // If no events in Redis or events are older than 6 hours, scrape new events
    if (events.length === 0 || Date.now() - lastUpdated > 6 * 60 * 60 * 1000) {
      try {
        const freshEvents = await scrapeAllEvents()
        return { events: freshEvents, lastUpdated: Date.now() }
      } catch (scrapeError) {
        console.error("Error scraping fresh events:", scrapeError)
        // If scraping fails, return sample events
        return { events: generateSampleEvents(), lastUpdated: Date.now() }
      }
    }

    return { events, lastUpdated }
  } catch (error) {
    console.error("Error in getEvents:", error)
    // Return sample events as fallback
    return { events: generateSampleEvents(), lastUpdated: Date.now() }
  }
}

// Function to get a single event by ID
export async function getEventById(id: string): Promise<Event | null> {
  try {
    const { events } = await getEvents()
    return events.find((event) => event.id === id) || null
  } catch (error) {
    console.error("Error getting event by ID:", error)
    return null
  }
}
