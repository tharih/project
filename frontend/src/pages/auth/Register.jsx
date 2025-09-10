import { useState } from "react";
export default function Register({ onLogin }) {
  const [form, setForm] = useState({ email: "", username: "", password: "", full_name: "" });
  const [loading, setLoading] = useState(false); const [err, setErr] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE || "";
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault(); setErr(""); setLoading(true);
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form)
    });
    setLoading(false);
    if (!res.ok) return setErr((await res.json()).detail || "Register failed");
    const data = await res.json(); onLogin?.(data);
  };
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-rose-50 to-amber-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-2">Create your account</h1>
        <p className="text-sm opacity-70 mb-6">Join with your student email and a username.</p>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="block text-sm mb-1">Full Name</label>
            <input name="full_name" className="w-full border rounded-xl p-3" onChange={onChange} placeholder="Alice Khan" /></div>
          <div><label className="block text-sm mb-1">Student Email</label>
            <input name="email" className="w-full border rounded-xl p-3" onChange={onChange} placeholder="alice@uni.edu" /></div>
          <div><label className="block text-sm mb-1">Username</label>
            <input name="username" className="w-full border rounded-xl p-3" onChange={onChange} placeholder="alice" /></div>
          <div><label className="block text-sm mb-1">Password</label>
            <input name="password" type="password" className="w-full border rounded-xl p-3" onChange={onChange} placeholder="••••••••" /></div>
          {err && <div className="text-red-600 text-sm">{err}</div>}
          <button disabled={loading} className="w-full py-3 rounded-xl bg-black text-white">
            {loading ? "Creating…" : "Create account"}
          </button>
          <div className="text-sm text-center">
            Already have an account? <a href="/login" className="underline">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  );
}