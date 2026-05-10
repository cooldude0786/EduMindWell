"use client";

import { useState } from "react";

type Subscriber = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
};

// Consistent date formatter that doesn't rely on locale
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function SubscribersList({
  initialSubscribers,
}: {
  initialSubscribers: Subscriber[];
}) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete ${email}?`)) {
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch(`/api/subscribers?id=${id}`, {
      method: "DELETE",
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to delete subscriber");
      return;
    }

    // Remove from UI
    setSubscribers((prev) => prev.filter((sub) => sub.id !== id));
  };

  return (
    <div className="border rounded p-4 space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded text-sm">
          {error}
        </div>
      )}

      {subscribers.length === 0 ? (
        <p className="text-sm text-gray-500">No subscribers found</p>
      ) : (
        <div className="space-y-2">
          <div className="text-sm text-gray-600 font-semibold mb-3">
            Total: {subscribers.length}
          </div>
          {subscribers.map((sub) => (
            <div
              key={sub.id}
              className="flex justify-between items-center border-b pb-3 last:border-b-0"
            >
              <div className="flex-1">
                <p className="font-medium">{sub.email}</p>
                <p className="text-sm text-gray-500">
                  {sub.name || "No name provided"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Added: {formatDate(new Date(sub.createdAt))}
                </p>
              </div>

              <button
                onClick={() => handleDelete(sub.id, sub.email)}
                disabled={loading}
                className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:bg-gray-200 disabled:text-gray-500"
                title="Delete subscriber"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
