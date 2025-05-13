import Link from "next/link"
import { getEvents } from "@/lib/scraper"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Revalidate the page every hour
export const revalidate = 3600

export default async function CategoriesPage() {
  try {
    const { events } = await getEvents()

    // Extract unique categories and count events in each
    const categories = events.reduce(
      (acc, event) => {
        const category = event.category || "Uncategorized"
        if (!acc[category]) {
          acc[category] = {
            name: category,
            count: 0,
            events: [],
          }
        }
        acc[category].count += 1
        acc[category].events.push(event)
        return acc
      },
      {} as Record<string, { name: string; count: number; events: any[] }>,
    )

    // Convert to array and sort by count
    const categoriesArray = Object.values(categories).sort((a, b) => b.count - a.count)

    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-12">
            <h1 className="mb-6 text-3xl font-bold">Event Categories</h1>

            {categoriesArray.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-10 text-center">
                <h3 className="text-lg font-semibold">No categories found</h3>
                <p className="text-sm text-muted-foreground">
                  We couldn't find any event categories. Please check back later.
                </p>
                <Button asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categoriesArray.map((category) => (
                  <Card key={category.name} className="overflow-hidden transition-all hover:shadow-lg">
                    <CardHeader className="bg-muted/50">
                      <CardTitle>{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-muted-foreground">
                        {category.count} {category.count === 1 ? "event" : "events"}
                      </p>
                      <div className="mt-4">
                        <Link
                          href={`/?category=${encodeURIComponent(category.name)}`}
                          className="text-sm text-primary hover:underline"
                        >
                          View all {category.name} events
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  } catch (error) {
    console.error("Error in CategoriesPage:", error)
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-12">
            <h1 className="mb-6 text-3xl font-bold">Event Categories</h1>
            <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-10 text-center">
              <h3 className="text-lg font-semibold">Error loading categories</h3>
              <p className="text-sm text-muted-foreground">
                We encountered an error while loading event categories. Please try again later.
              </p>
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
}
