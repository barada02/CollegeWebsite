import Link from "next/link";
import { getEvents } from "@/lib/server-api";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
}

export default async function Home() {
  // Fetch upcoming events for the homepage using server-side API function
  const events = await getEvents({ upcoming: true }) as Event[];
  const featuredEvents = events.slice(0, 3); // Take the first 3 upcoming events

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Our College</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Empowering the future through excellence in education, innovation, and community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/events" 
                className="bg-white text-blue-900 hover:bg-gray-100 px-6 py-3 rounded-md font-semibold text-lg"
              >
                Explore Events
              </Link>
              <a 
                href="#featured-events" 
                className="bg-blue-700 hover:bg-blue-600 px-6 py-3 rounded-md font-semibold text-lg"
              >
                Latest Updates
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section id="featured-events" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <p className="mt-4 text-xl text-gray-600">
              Join us for these exciting upcoming events
            </p>
          </div>

          {featuredEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-600">No upcoming events at this time</h3>
              <p className="mt-2 text-gray-500">Check back later for new events.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((event) => (
                <div key={event._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  {event.image ? (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-blue-200 flex items-center justify-center">
                      <span className="text-blue-800 font-medium">College Event</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-sm font-medium text-blue-600 mb-1">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{event.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {event.description.length > 100 
                        ? `${event.description.substring(0, 100)}...` 
                        : event.description}
                    </p>
                    <div className="flex items-center text-gray-500 mb-4">
                      <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    <Link 
                      href={`/events/${event._id}`} 
                      className="inline-block bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link 
              href="/events" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About Our College</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 1980, our college has been a beacon of academic excellence for over 40 years. 
                We are committed to providing a nurturing environment where students can thrive 
                intellectually, socially, and professionally.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our diverse community of faculty, staff, and students collaborates to create a 
                dynamic learning experience that prepares graduates for the challenges of tomorrow.
              </p>
              <a 
                href="#" 
                className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Learn More About Us
              </a>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="bg-gray-200 rounded-lg overflow-hidden">
                <div className="h-64 lg:h-96 bg-gray-300">
                  {/* Placeholder for college image */}
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">College Campus Image</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
