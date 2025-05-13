import Header from "@/components/header"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12">
          <h1 className="mb-6 text-3xl font-bold">About Sydney Events</h1>

          <div className="space-y-6">
            <p>
              Sydney Events is your go-to platform for discovering the best events happening in Sydney, Australia. Our
              mission is to help locals and visitors alike find exciting experiences in this vibrant city.
            </p>

            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p>
              We believe that everyone should have easy access to information about cultural, entertainment, and social
              events in Sydney. Our platform automatically aggregates events from various sources to provide you with a
              comprehensive list of what's happening around the city.
            </p>

            <h2 className="text-2xl font-semibold">How It Works</h2>
            <p>
              Our system regularly scans popular event websites in Sydney to collect information about upcoming events.
              We organize this data and present it in an easy-to-browse format, allowing you to quickly find events that
              interest you.
            </p>

            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p>
              If you have any questions, suggestions, or feedback, please don't hesitate to reach out to us at
              <a href="mailto:info@sydneyevents.example.com" className="text-primary hover:underline">
                {" "}
                info@sydneyevents.example.com
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
