import { useEffect, useRef, useState } from "react";
export default function FaceLogin({ onLogin }) {
  const [identity, setIdentity] = useState(""); const [sessionId, setSessionId] = useState("");
  const [err, setErr] = useState(""); const [progress, setProgress] = useState("idle");
  const videoRef = useRef(null); const API_BASE = import.meta.env.VITE_API_BASE || "";
  const start = async () => {
    setErr(""); setProgress("starting");
    const r = await fetch(`${API_BASE}/api/auth/face/start`,{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ identity }) });
    if (!r.ok) { setErr("Start failed"); setProgress("idle"); return; }
    const data = await r.json(); setSessionId(data.face_session_id); setProgress("camera"); await enableCamera();
    setTimeout(() => verify(`demo-token-${data.face_session_id}`), 1500);
  };
  const enableCamera = async () => {
    try { const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream; }
    except (e) { setErr("Camera access denied"); setProgress("idle"); }
  };
  const verify = async (faceToken) => {
    setProgress("verifying");
    const r = await fetch(`${API_BASE}/api/auth/face/verify`,{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ face_token: faceToken }) });
    if (!r.ok) { setErr("Face verify failed"); setProgress("idle"); return; }
    const data = await r.json(); onLogin?.(data);
  };
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-violet-50 to-fuchsia-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-2">Sign in with Face</h1>
        <p className="text-sm opacity-70 mb-6">Hands-free, fast, and secure.</p>
        <div className="space-y-4">
          <div><label className="block text-sm mb-1">Email or Username</label>
            <input className="w-full border rounded-xl p-3" value={identity} onChange={e=>setIdentity(e.target.value)} placeholder="e.g. alice or alice@uni.edu" /></div>
          <button onClick={start} className="w-full py-3 rounded-xl bg-black text-white">Start face sign-in</button>
          {progress !== "idle" && (<div className="rounded-xl border p-3 space-y-2">
              <div className="text-sm opacity-70">Session: {sessionId.slice(0,16)}…</div>
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl" />
              <div className="text-sm">{progress === "starting" && "Starting…"}
                {progress === "camera" && "Align your face in the frame…"}{progress === "verifying" && "Verifying…"}
              </div></div>)}
          <div className="text-sm text-center">Prefer password? <a href="/login" className="underline">Sign in here</a></div>
        </div>
      </div>
    </div>
  );
}