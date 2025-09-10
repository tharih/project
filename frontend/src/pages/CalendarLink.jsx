import { useState } from "react";

export default function CalendarLink() {
  const [fromIso, setFromIso] = useState("");
  const [toIso, setToIso] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE || "";

  const buildUrl = () => {
    if (!fromIso || !toIso) return "";
    return `${API_BASE}/api/calendar/attendance.ics?from_iso=${encodeURIComponent(fromIso)}&to_iso=${encodeURIComponent(toIso)}`;
  };

  const url = buildUrl();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Calendar Feed</h1>
      <p className="mb-3 text-sm opacity-80">
        Create a URL you can paste into Google Calendar → Settings → Add calendar → From URL.
      </p>
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">From (ISO)</label>
          <input className="border rounded p-2 w-full" placeholder="2025-08-01T00:00:00Z" value={fromIso} onChange={e=>setFromIso(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">To (ISO)</label>
          <input className="border rounded p-2 w-full" placeholder="2025-08-31T23:59:59Z" value={toIso} onChange={e=>setToIso(e.target.value)} />
        </div>
        {url && (
          <div className="mt-2 break-all">
            <div className="text-sm font-mono border rounded p-2 bg-gray-50">{url}</div>
            <a href={url} target="_blank" className="inline-block mt-2 underline">Open feed</a>
          </div>
        )}
      </div>
    </div>
  );
}
