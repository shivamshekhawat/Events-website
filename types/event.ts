export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  address: string
  imageUrl: string
  ticketUrl: string
  price: string
  category: string
  createdAt: number
  updatedAt: number
}

export interface EmailSubscription {
  email: string
  eventId: string
  timestamp: number
}
