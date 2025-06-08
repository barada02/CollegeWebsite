// Server-side data fetching utilities

/**
 * Fetches data from the API on the server side
 * @param url The URL to fetch from
 * @param options Additional fetch options
 * @returns The response data
 */
export async function fetchFromAPI(url: string, options?: RequestInit) {
  try {
    const apiUrl = `http://localhost:5000/api${url}`;
    const response = await fetch(apiUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from API (${url}):`, error);
    return null;
  }
}

/**
 * Get all events with optional filtering
 */
export async function getEvents(params?: { past?: boolean; upcoming?: boolean }) {
  const queryParams = new URLSearchParams();
  
  if (params?.past) {
    queryParams.append('past', 'true');
  }
  
  if (params?.upcoming) {
    queryParams.append('upcoming', 'true');
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const data = await fetchFromAPI(`/events${queryString}`);
  
  return data?.events || [];
}

/**
 * Get a single event by ID
 */
export async function getEventById(id: string) {
  const data = await fetchFromAPI(`/events/${id}`);
  return data || null;
}
