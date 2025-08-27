# FaceSense — Fullstack (React + FastAPI + Emotion Detection)

## Run everything
### Backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```
### Frontend (new terminal)
```bash
cd frontend
npm install
cp .env.example .env
# Ensure VITE_API_BASE_URL=http://localhost:8000
npm run dev
```
### Login
Use **admin / admin**.

## Emotion Detection
- Go to **Emotion Detection** in sidebar.
- Allow camera permission. Frames are sent ~every 700ms to `/api/emotion/detect`.
- The canvas shows bounding boxes + top emotion, alongside a rolling distribution chart.
