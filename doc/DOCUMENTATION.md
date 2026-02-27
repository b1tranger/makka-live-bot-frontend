# Makka Live Bot | Technical Documentation

## Project Overview
Makka Live Bot is a specialized Discord music bot designed for high-quality audio streaming from YouTube. It features a unique "Remote Control" architecture that allows users to host the bot on their local machines while controlling it via a centralized web dashboard, all while keeping the source code and tokens protected.

## Tech Stack & Libraries

### Core Backend
- **Python 3.10+**: Primary programming language.
- **discord.py [voice]**: Framework for Discord API interaction and voice support.
- **yt-dlp**: Advanced YouTube metadata extraction and streaming.
- **aiohttp**: Asynchronous HTTP client for Quran API requests.
- **PyNaCl**: Networking and Cryptography library required for Discord Voice.
- **static-ffmpeg**: Automatically handles FFmpeg binaries for audio processing.

### Bridge API
- **FastAPI**: High-performance web framework for the control bridge.
- **Uvicorn**: ASGI server for running the FastAPI application.
- **psutil**: For monitoring and managing the bot process lifecycle.
- **PyInstaller**: Used to package the system into a protected, standalone Windows executable.

### Frontend Dashboard
- **HTML5/CSS3**: Modern responsive layout with Glassmorphism aesthetics.
- **marked.js**: Fast markdown parser and compiler for in-dashboard documentation viewing.
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

### v1.5.0 (Quran & Documentation Integration)
- **Quran API**: Integrated `api.quran.com` for high-quality recitation and verse data.
- **Interactive Commands**: Added `!quran`, `!ayah`, `!reciters`, and `!translate`.
- **Navigation Buttons**: Implemented Discord UI buttons for flipping through ayah translations.
- **In-Dashboard Docs**: Added a markdown viewer to the dashboard for reading documentation locally without leaving the site.
- **Smart Notifications**: Priority-based message routing to minimize channel clutter (Bot-channel > Voice Chat > System).

### v1.6.0 (Automatic Failover & Reliability Update)
- **Standby Mode**: Multiple instances can now run simultaneously without conflicts.
- **Heartbeat System**: Master instances broadcast a "Stay Alive" signal every 15 seconds.
- **Automatic Failover**: Standby instances promote themselves to Master if the active heartbeat is lost for >35 seconds.
- **State Recovery**: Upon failover, Standby instances automatically rejoin the voice channels the previous Master was in.

### v1.7.0 (Content Focus & API Upgrade)
- **Islamic Content Filter**: `!play` now validates video titles against a curated list of Islamic keywords (Nasheeds, Quran, Lectures).
- **Moderation Bypass**: Added `!haram` command to bypass filters (logged to moderator channels for accountability).
- **FFmpeg Bundling**: FFmpeg binaries are now baked into the `.exe`, eliminating first-run downloads.
- **Quran Foundation API**: Upgraded to support the latest Quran Foundation API with Client ID/Secret security.
- **Silent Heartbeats**: Heartbeat messages are now sent in "Silent" mode to prevent constant notification pings.
- **Command Help**: Added a custom interactive `!help` command with detailed field groups.

---

## Bot Commands

The following commands are available to interact with the bot in Discord.

### Music & Media
| Command | Usage | Description |
| :--- | :--- | :--- |
| `!help` | `!help` | Displays a detailed menu of all available bot commands. |
| `!join` | `!join` | Connects the bot to your current voice channel. |
| `!play` | `!play <URL>` | Plays audio from a YouTube video or search (Islamic content only). |
| `!haram` | `!haram <URL>` | Bypasses the Islamic filter (usage is logged for moderators). |
| `!pause` | `!pause` | Pauses the current playback. |
| `!resume` | `!resume` | Resumes a paused playback. |
| `!skip` | `!skip` | Skips the current track and plays the next in queue. |
| `!stop` | `!stop` | Stops playback, clears the queue, and disconnects the bot. |

### Quran Recitation
| Command | Usage | Description |
| :--- | :--- | :--- |
| `!quran` | `!quran <surah> <start> [end] [reciter]` | Plays a range of verses. Default reciter ID is 7. |
| `!ayah` | `!ayah <surah> <ayah> [reciter]` | Plays a single verse from a specific surah. |
| `!reciters`| `!reciters` | Lists the top 20 available reciter IDs. |
| `!translate`| `!translate <surah> <ayah> [lang]` | Shows the translation of an ayah with ◀️/▶️ navigation buttons. |

### System & Failover
| Command | Usage | Description |
| :--- | :--- | :--- |
| `!close_bot`| `!close_bot` | Safely shuts down the Master instance and triggers instant failover to Standby. |

---

## Technical Features

### Concurrency Control (Heartbeat & Failover)
To ensure 100% uptime and prevent API conflicts, the bot uses a decentralized failover system:
1. **Handshake**: On startup, the instance checks for an active Master. If found, it enters **Standby Mode**.
2. **Master Announcement**: Upon becoming Master (at startup or via failover), the instance sends a one-time message: `👑 Makka Master: Instance [SID:...] is now ACTIVE.`
3. **Heartbeat**: The Master instance sends a background heartbeat `💓 [HB:...]` every 15 seconds to update the `last_heartbeat` timestamp on Standby instances.
4. **Promotion**: If no heartbeat is received for 35 seconds, or if a "Shutting Down" signal is detected, a Standby instance promotes itself to **Master**.
5. **State Recovery**: The new Master uses the last known voice channel data from the heartbeat to automatically reconnect.

### Music Queue & Playlist Architecture
The bot maintains a dictionary of queues keyed by Guild ID. When a playlist URL is provided:
1. The bot uses `extract_flat` to quickly gather metadata for all playlist entries.
2. URLs are appended to the guild's queue.
3. The `after` callback in `voice_client.play` triggers `play_next`, ensuring continuous playback without manual intervention.

### Integrated Environment
The `.env` and `bot.py` files are bundled directly into the `MakkaLauncher.exe` using PyInstaller's `--add-data` flag. The environment is loaded dynamically using `sys._MEIPASS` redirection.

### Quran Foundation API Integration
The bot leverages the Quran Foundation API to fetch verse information, translations, and audio URLs.
- **Secure Access**: Supports `QURAN_CLIENT_ID` and `QURAN_CLIENT_SECRET` for authorized playback.
- **Reciter Selection**: Users can choose from hundreds of reciters via ID.
- **Translation Navigation**: Uses `discord.ui.View` with buttons to allow stateful navigation between verses.
- **Audio Delivery**: Direct MP3 streaming via FFmpeg bypasses local download overhead for instant playback.

### Islamic Content Filtering Logic
To maintain the focus of the server, the bot implements a two-stage filter:
1. **Halal Keywords**: Searches title for terms like `Nasheed`, `Dhikr`, `Lecture`, `Quran`.
2. **Haram Keywords**: Explicitly blocks terms like `Pop`, `Rock`, `Club`, `Remix`, `Dance`.
3. **Bypass Protocol**: The `!haram` command allows playing unverified content but triggers a moderator alert with the user's name and content link.

### Message Routing Logic
To maintain server cleanliness, the bot uses a priority system for notifications:
1. Searches for any channel containing "spam" or "bot" in the name.
2. If none exist, it targets the Text-In-Voice channel of the user who triggered the command.
3. Final fallback to the server's System Channel or first writable text channel.

---

## Known Issues & Fixes

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| **FFmpeg Not Found** | System PATH not configured. | Integrated `static-ffmpeg` and bundled binaries into EXE. |
| **Duplicate Processes** | Multiple people running EXE. | **Handshake Lock**: Instances auto-negotiate who stays active based on login order. |
| **Source Exposure** | Sharing Python files reveals tokens. | Implemented PyInstaller with `--add-data` to hide files in binary. |
| **Port Conflict** | Launcher opened twice on one PC. | Added port-in-use detection in `server.py` with custom error prompts. |
| **OpusNotLoaded** | PyInstaller stripped Opus DLLs. | Updated `build_launcher.py` to bundle the `discord/bin` directory. |
