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

### v1.3.0 (Media Control & Reliability Update)
- **Playlist Support**: Integrated `yt-dlp` flat-extraction to handle entire YouTube playlists.
- **Queue System**: Added music queue for seamless back-to-back playback.
- **Handshake Protocol**: Implemented session-based locking to prevent multiple EXE instances from conflicting.
- **Opus Bundle Fix**: Updated PyInstaller build script to include native Opus DLLs for standalone audio reliability.

### v1.4.0 (UX & Dashboard Update)
- **Dual Connection Modes**: Categorized bot hosting into **Option 1 (Remote)** and **Option 2 (Local)** for better user clarity.
- **Improved UI**: Reorganized the control section to group bot operations together.
- **FAQ Enhancements**: Added scrollable FAQ section with custom hidden scrollbars for improved UX.
- **Dynamic Footer**: Implemented automatic year updates in the footer via JavaScript.

---

## Technical Features

### Concurrency Control (Handshake Protocol)
To prevent Discord API conflicts when multiple users run the `.exe` simultaneously, the bot follows a "First-Come, First-Served" rule:
1. New instances broadcast a "Handshake Request" via Discord with a unique **Session ID**.
2. If an active instance exists, it responds with a "Master Claim."
3. The new instance detects the claim (ignoring its own Session ID) and shuts down immediately to ensure a stable stream.

### Music Queue & Playlist Architecture
The bot maintains a dictionary of queues keyed by Guild ID. When a playlist URL is provided:
1. The bot uses `extract_flat` to quickly gather metadata for all playlist entries.
2. URLs are appended to the guild's queue.
3. The `after` callback in `voice_client.play` triggers `play_next`, ensuring continuous playback without manual intervention.

### Integrated Environment
The `.env` and `bot.py` files are bundled directly into the `MakkaLauncher.exe` using PyInstaller's `--add-data` flag. The environment is loaded dynamically using `sys._MEIPASS` redirection.

---

## Known Issues & Fixes

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| **FFmpeg Not Found** | System PATH not configured. | Integrated `static-ffmpeg` to auto-detect/download binaries. |
| **Duplicate Processes** | Multiple people running EXE. | **Handshake Lock**: Instances auto-negotiate who stays active based on login order. |
| **Source Exposure** | Sharing Python files reveals tokens. | Implemented PyInstaller with `--add-data` to hide files in binary. |
| **Port Conflict** | Launcher opened twice on one PC. | Added port-in-use detection in `server.py` with custom error prompts. |
| **OpusNotLoaded** | PyInstaller stripped Opus DLLs. | Updated `build_launcher.py` to bundle the `discord/bin` directory. |
