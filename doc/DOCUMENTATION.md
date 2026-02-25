# Makka Live Bot | Technical Documentation

## Project Overview
Makka Live Bot is a specialized Discord music bot designed for high-quality audio streaming from YouTube. It features a unique "Remote Control" architecture that allows users to host the bot on their local machines while controlling it via a centralized web dashboard, all while keeping the source code and tokens protected.

## Tech Stack & Libraries

### Core Backend
- **Python 3.10+**: Primary programming language.
- **discord.py [voice]**: Framework for Discord API interaction and voice support.
- **yt-dlp**: Advanced YouTube metadata extraction and streaming.
- **PyNaCl**: Networking and Cryptography library required for Discord Voice.
- **static-ffmpeg**: Automatically handles FFmpeg binaries for audio processing.

### Bridge API
- **FastAPI**: High-performance web framework for the control bridge.
- **Uvicorn**: ASGI server for running the FastAPI application.
- **psutil**: For monitoring and managing the bot process lifecycle.
- **PyInstaller**: Used to package the system into a protected, standalone Windows executable.

### Frontend Dashboard
- **HTML5/CSS3**: Modern responsive layout with Glassmorphism aesthetics.
- **Vanilla JavaScript**: For real-time state polling and API communication.

---

## Version History

### v1.0.0 (Initial Release)
- Basic bot implementation for joining voice channels and playing YouTube URLs.
- Integrated `yt-dlp` for robust video-to-audio streaming.

### v1.1.0 (Remote Control Update)
- Created `server.py` bridge to allow web-based start/stop commands.
- Implemented `frontend` dashboard with status tracking.
- Added `build_launcher.py` to package the bot as a protected `.exe`.
- Added dynamic "Invite Bot" button functionality.

---

## Known Issues & Fixes

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| **FFmpeg Not Found** | System PATH not configured. | Integrated `static-ffmpeg` to auto-detect/download binaries. |
| **Duplicate Processes** | Restarting bot without closing old one. | Implemented `psutil` check in `server.py` to kill stale PIDs. |
| **Source Exposure** | Sharing Python files reveals tokens. | Implemented PyInstaller with `--add-data` to hide files in binary. |
| **Broken Paths in EXE** | `_MEIPASS` temp folder redirection. | Added `get_resource_path()` logic to handle packaged paths. |
