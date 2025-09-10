import { useEffect, useState } from "react";

export default function Integrations() {
  const [form, setForm] = useState({ slack_webhook: "", teams_webhook: "" });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE || "";

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/settings/integrations`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            slack_webhook: data.slack_webhook || "",
            teams_webhook: data.teams_webhook || ""
          });
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaved(false);
    const res = await fetch(`${API_BASE}/api/settings/integrations`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) setSaved(true);
  };

  if (loading) return <div className="p-4">Loading…</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notifications & Integrations</h1>
      <p className="mb-6 text-sm opacity-80">
        Paste your Slack or Microsoft Teams incoming webhook URLs. Attendance events will be posted there.
      </p>
      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Slack Webhook URL</label>
          <input
            type="url"
            name="slack_webhook"
            className="border rounded w-full p-2"
            placeholder="https://hooks.slack.com/services/…"
            value={form.slack_webhook}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Microsoft Teams Webhook URL</label>
          <input
            type="url"
            name="teams_webhook"
            className="border rounded w-full p-2"
            placeholder="https://outlook.office.com/webhook/…"
            value={form.teams_webhook}
            onChange={onChange}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-black text-white"
          >
            Save
          </button>
          {saved && <span className="text-green-600 text-sm">Saved ✓</span>}
        </div>
      </form>
    </div>
  );
}
