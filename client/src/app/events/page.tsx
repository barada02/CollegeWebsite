import Link from "next/link";
import { fetchAllEvents } from "@/lib/api";

export default async function EventsPage() {
  // Fetch all events
  const events = await fetchAllEvents();

  // Separate upcoming and past events
  const currentDate = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) >= currentDate);
  const pastEvents = events.filter(event => new Date(event.date) < currentDate);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">College Events</h1>
        <p className="text-lg text-gray-600">
          Stay updated with all the events happening at our college
        </p>
      </header>

      {/* Upcoming Events Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
        
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-600">No upcoming events at this time</h3>
            <p className="mt-2 text-gray-500">Check back later for new events.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
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
      </section>

      {/* Past Events Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h2>
        
        {pastEvents.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-600">No past events to display</h3>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <div key={event._id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <div className="p-5">
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800">{event.title}</h3>
                  <p className="text-gray-600 mb-3 text-sm">
                    {event.description.length > 80
                      ? `${event.description.substring(0, 80)}...` 
                      : event.description}
                  </p>
                  <Link 
                    href={`/events/${event._id}`} 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Event Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
