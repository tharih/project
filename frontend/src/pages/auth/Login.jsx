import { useState } from "react";
export default function Login({ onLogin }) {
  const [identity, setIdentity] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); const [err, setErr] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE || "";
  const submit = async (e) => {
    e.preventDefault(); setErr(""); setLoading(true);
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity, password })
    });
    setLoading(false);
    if (!res.ok) return setErr((await res.json()).detail || "Login failed");
    const data = await res.json(); onLogin?.(data);
  };
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-50 to-sky-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-sm opacity-70 mb-6">Sign in with your email or username.</p>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="block text-sm mb-1">Email or Username</label>
            <input className="w-full border rounded-xl p-3" value={identity} onChange={e=>setIdentity(e.target.value)} placeholder="e.g. alice or alice@uni.edu" /></div>
          <div><label className="block text-sm mb-1">Password</label>
            <input className="w-full border rounded-xl p-3" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" /></div>
          {err && <div className="text-red-600 text-sm">{err}</div>}
          <button disabled={loading} className="w-full py-3 rounded-xl bg-black text-white">
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <div className="flex justify-between text-sm">
            <a href="/register" className="underline">Create account</a>
            <a href="/forgot" className="underline">Forgot password?</a>
          </div>
          <div className="relative py-2 text-center text-sm opacity-60">or</div>
          <a href="/face-login" className="w-full block text-center py-3 rounded-xl border">Sign in with Face</a>
        </form>
      </div>
    </div>
  );
}