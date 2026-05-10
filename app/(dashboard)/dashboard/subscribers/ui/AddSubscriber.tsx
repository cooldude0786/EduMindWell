"use client";

import { useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddSubscriber() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAdd = async () => {
    setError("");
    setSuccess("");

    // Client-side validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setError("Invalid email format");
      return;
    }

    if (name && name.trim().length > 100) {
      setError("Name must be 100 characters or less");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        email: email.trim(), 
        name: name.trim() || null 
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to add subscriber");
      return;
    }

    setSuccess(`${data.email} added successfully`);
    setEmail("");
    setName("");

    // Reload to show new subscriber
    window.location.reload();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleAdd();
    }
  };

  return (
    <div className="border p-4 rounded space-y-3">
      <h2 className="font-semibold">Add Subscriber</h2>

      <div>
        <input
          className="border p-2 w-full rounded"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          type="email"
          disabled={loading}
        />
      </div>

      <div>
        <input
          className="border p-2 w-full rounded"
          placeholder="Name (optional, max 100 characters)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          maxLength={100}
          disabled={loading}
        />
        <div className="text-xs text-gray-500 mt-1">
          {name.length} / 100
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-2 rounded text-sm">
          {success}
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={loading || !email.trim()}
        className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-400 w-full"
      >
        {loading ? "Adding..." : "Add Subscriber"}
      </button>
    </div>
  );
}