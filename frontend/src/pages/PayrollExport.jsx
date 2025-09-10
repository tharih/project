import { useState } from "react";

export default function PayrollExport() {
  const [fromIso, setFromIso] = useState("");
  const [toIso, setToIso] = useState("");
  const [downloading, setDownloading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE || "";

  const dl = async () => {
    if (!fromIso || !toIso) return;
    setDownloading(true);
    const url = `${API_BASE}/api/reports/payroll?from_iso=${encodeURIComponent(fromIso)}&to_iso=${encodeURIComponent(toIso)}`;
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "payroll.csv";
    a.click();
    setDownloading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Payroll Export</h1>
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">From (ISO)</label>
          <input className="border rounded p-2 w-full" placeholder="2025-08-01T00:00:00Z" value={fromIso} onChange={e=>setFromIso(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">To (ISO)</label>
          <input className="border rounded p-2 w-full" placeholder="2025-08-31T23:59:59Z" value={toIso} onChange={e=>setToIso(e.target.value)} />
        </div>
        <button onClick={dl} className="px-4 py-2 rounded bg-black text-white" disabled={downloading}>
          {downloading ? "Exporting…" : "Download CSV"}
        </button>
      </div>
    </div>
  );
}
