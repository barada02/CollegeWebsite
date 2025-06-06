import { fetchEventById } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EventPageProps {
  params: {
    id: string;
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const event = await fetchEventById(params.id);

  if (!event) {
    notFound();
  }

  // Format the date
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Format the time
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link href="/events" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </Link>
      </div>

      <article className="bg-white rounded-lg overflow-hidden shadow-md">
        {/* Event Image */}
        {event.image ? (
          <div className="h-64 md:h-96 overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-64 md:h-96 bg-blue-100 flex items-center justify-center">
            <span className="text-blue-800 font-medium text-xl">College Event</span>
          </div>
        )}

        {/* Event Content */}
        <div className="p-8">
          <div className="text-lg font-medium text-blue-600 mb-2">
            {formattedDate} at {formattedTime}
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-gray-900">{event.title}</h1>
          
          <div className="flex items-center text-gray-600 mb-6">
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
          
          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Event Details</h2>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="font-medium mr-2">Organized by:</span>
                  <span>{event.organizer}</span>
                </li>
                {event.registrationLink && (
                  <li className="flex items-start">
                    <span className="font-medium mr-2">Registration:</span>
                    <a 
                      href={event.registrationLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Register for this event
                    </a>
                  </li>
                )}
              </ul>
            </div>
            
            {event.registrationLink && (
              <div className="mt-8">
                <a 
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold"
                >
                  Register Now
                </a>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
