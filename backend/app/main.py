import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from typing import List
from backend.routers import settings as settings_router
from .database import Base, engine, get_db
from .models import Account, Person, Attendance
from .schemas import LoginRequest, TokenResponse, UserCreate, UserOut, AttendanceOut
from .auth import verify_password, create_access_token, get_current_account
from .seed import seed
from . import emotion

load_dotenv()
Base.metadata.create_all(bind=engine)
with next(get_db()) as db:
    seed(db)


app = FastAPI(title="FaceSense API", version="1.0.0")

app.include_router(settings_router.router)

origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(emotion.router)

@app.post("/api/login", response_model=TokenResponse, tags=["auth"])
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.username == payload.username).first()
    if not account or not verify_password(payload.password, account.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    token = create_access_token({"sub": account.username})
    return {"token": token}

@app.get("/api/users/recent", response_model=List[UserOut], tags=["users"])
def get_recent_users(db: Session = Depends(get_db), _: Account = Depends(get_current_account)):
    return db.query(Person).order_by(Person.id.desc()).limit(10).all()

@app.post("/api/users", response_model=UserOut, tags=["users"])
def add_user(payload: UserCreate, db: Session = Depends(get_db), _: Account = Depends(get_current_account)):
    p = Person(name=payload.name); db.add(p); db.commit(); db.refresh(p); return p

@app.get("/api/attendance", response_model=List[AttendanceOut], tags=["attendance"])
def get_attendance(db: Session = Depends(get_db), _: Account = Depends(get_current_account)):
    rows = db.query(Attendance).join(Person, Attendance.person_id == Person.id).order_by(Attendance.timestamp.desc()).all()
    return [AttendanceOut(id=r.id, name=r.person.name, emotion=r.emotion, timestamp=r.timestamp) for r in rows]
