"""
DỊCH VỤ ĐỒNG HÀNH CỤC BỘ (OPTIONAL LOCAL COMPANION - PYTHON FASTAPI)

Chỉ chạy trên 127.0.0.1:3111 với token bảo mật cục bộ.
"""

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Personal Music Hub Local Companion")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AUTH_TOKEN = "local-token-secure-pmh"

def verify_token(authorization: str = Header(None)):
    if not authorization or authorization != f"Bearer {AUTH_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid local token")

class DownloadRequest(BaseModel):
    url: str
    format: str = "mp3"
    outputName: str

@app.get("/api/health")
def health_check(authorization: str = Header(None)):
    verify_token(authorization)
    return {
        "status": "ok",
        "version": "1.0.0",
        "ffmpeg": True,
        "ytdlp": True,
        "message": "Dịch vụ Python FastAPI Companion đang chạy"
    }

@app.post("/api/download")
def download_media(req: DownloadRequest, authorization: str = Header(None)):
    verify_token(authorization)
    print(f"[Python Companion] Tải URL: {req.url} -> {req.format}")
    return {
        "success": True,
        "message": f"Đã tiếp nhận yêu cầu tải cho {req.outputName}"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=3111)
