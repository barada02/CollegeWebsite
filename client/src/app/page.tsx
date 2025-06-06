import Link from "next/link";
import { fetchAllData, DataItem } from "@/lib/api";

export default async function Home() {
  // Fetch data from the API
  const data = await fetchAllData();

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">College Website Data</h1>
        <Link 
          href="/form" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
        >
          Add New Data
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-medium text-gray-600 dark:text-gray-300">No data available</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Start by adding some data using the form.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item: DataItem) => (
            <div key={item._id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{item.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Created: {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
