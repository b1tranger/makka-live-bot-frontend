# Makka Live Bot | Technical Documentation

## Project Overview
Makka Live Bot is a specialized Discord audio bot designed for high-quality, pure Islamic audio and Quran recitation streaming powered directly by the Quran Foundation API. It features a unique decentralized "Master-Standby" failover architecture that guarantees 100% uptime, byte-accurate stream state transfers, and an intuitive web control center dashboard.

## Tech Stack & Libraries

### Core Backend
- **Python 3.10+**: Primary programming language.
- **discord.py [voice] (v2.7.0+)**: Framework for Discord API interaction and mandatory DAVE (E2EE) voice support.
- **yt-dlp**: YouTube metadata extractor and streamer (retained for archived fallback routines).
- **aiohttp**: Asynchronous HTTP client for Quran Foundation API requests.
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
- **Navigation & Audio**: Implemented Discord UI buttons for flipping through ayah translations and playing verse audio inline (default reciter 7).
- **Rich Verse Data**: `!translate` now displays Uthmani Arabic text alongside the translation and includes the localized Surah name.
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
- **Quran Foundation API**: Upgraded to support the latest Quran Foundation API with Client ID/Secret security.
- **Silent Heartbeats**: Heartbeat messages are now sent in "Silent" mode to prevent constant notification pings.
- **Command Help**: Added a custom interactive `!help` command with detailed field groups.

### v1.8.0 (Android & Usability Update)
- **Android Support**: Added `MakkaLauncher-Android` (Linux ARM64 binary build) via GitHub Actions for secure deployment on Termux without exposing tokens.
- **Surah Query**: Added `!surah` command which lists all 114 Surahs and total ayah counts in an optimized 3-column format spanning two Discord messages to bypass character limits.
- **Static FFmpeg Re-Integration**: PyInstaller now uses `--collect-all=static_ffmpeg` to bundle FFmpeg binaries natively, preserving seamless execution for both full Windows `.exe` builds and direct `python bot.py` development environments without errors.

### v1.8.1 (Quran API Pagination Fix)
- **Verse Pagination**: Increased the verses-per-page limit in the Quran API requests to retrieve up to 286 verses (maximum in any Surah) per API call, fixing a bug where `!quran` would abruptly stop queuing after 10 verses.

### v1.9.0 (Seamless Failover & Radio Mode)
- **📻 Radio Mode**: Added `!quran radio [reciter_id]` feature to queue non-stop randomized Surahs safely without interrupting ongoing streams.
- **🔄 Seamless Byte-Accurate State Transfer**: The Master instance now intercepts and counts underlying FFMPEG PCM bytestreams (`192,000` b/s). The paused/playing track's exact playback timestamp is saved into the ZLib-Base64 heartbeat payload. Standbys use this data to execute `-ss` injections to insta-skip precisely to where the Master disconnected!
- **⚡ Collision Resolution (Split-Brain Fix)**: Added active bot-state collision negotiation. If two competing Master instances rapidly connect due to overlapping start-times, the bot with the lower UUID safely drops Master status and disconnects its conflicting Voice Clients instead of endlessly producing Discord WebSocket `4006` closing code loops.
- **Documentation**: Updated `!help` to precisely detail `!play live` usage, explicit `!quran full` syntax, and newly hid the `!close_bot` system command.

### v1.9.1 (DAVE Protocol & Encryption Update)
- **Discord Voice E2EE Support**: Upgraded to `discord.py` v2.7.0 to support Discord's mandatory DAVE (Audio & Video End-to-End Encryption) protocol.
- **Connection Stability**: Fixed the `4017` WebSocket close code that caused intermittent voice disconnects after March 2026.
- **Build Dependency**: Note: Building from source now requires the Rust/Cargo toolchain installed on the host system to compile the `davey` encryption library.

### v1.9.2 (Filter Expansion & PyNaCl Fix)
- **Extensive Content Filter**: Significantly expanded the `HALAL_KEYWORDS` and `HARAM_KEYWORDS` lists with categories covering concepts, practices, entertainment, lifestyle, and Arabic script. Made the filter fully case-insensitive.
- **Strict Bypass Enforcement**: The `!haram` command now actively blocks users from playing Islamic content (titles containing Halal keywords) through the bypass, prompting them to use the proper `!play` command instead.
- **Executable Voice Fix**: Fixed the `RuntimeError: PyNaCl library needed in order to use voice` error in the standalone `.exe` by explicitly bundling the `nacl` native binaries (`_sodium.pyd`) and submodules in the `build_launcher.py` script.

### v2.0.0 (YouTube Playback Deprecation, Quran API Pivot & Changelog Modal)
- **YouTube Playback Deprecation**: Disabled execution of `!play`, `!play live`, and `!haram` commands in response to persistent YouTube bot-blocking and datacenter IP restrictions. Replaced active playback with user-facing warnings redirecting to direct Quran Foundation API commands.
- **Updated `!help` System**: Overhauled bot help guidance to reflect the pure Quran streaming architecture.
- **Repository Guidelines & Standards**: Added `AGENTS.md` defining strict prompt archiving (`doc/prompts/`), history maintenance (`doc/history.md`), and dual-write conventions.
- **Frontend Changelog Modal**: Integrated dynamic what's new changelog modal (`changes.json`, `changelog-modal.js`) on the web dashboard with offline fallback support.

### v2.1.0 (Quran Central RSS Provider, Dual Reciter Namespace & CDN Streaming)
- **Quran Central RSS Audio Provider**: Extended playback capabilities with `qurancentral.com` as a secondary audio provider via podcast RSS feeds (`https://rss.qurancentral.com/{slug}.rss`).
- **Unambiguous `A#` Reciter Namespace & Expanded Catalog**: Assigned deterministic `A#` IDs (`A1` to `A46`) for Quran Central reciters (e.g., `A1` maps to Ibi Idris) with slug fallback resolution, completely avoiding ID conflicts with numeric Quran Foundation reciters (`1` to `176`).
- **Direct Remote Audio Streaming & CDN Header Injection**: Whitelisted `qurancentral.com` in `YTDLSource.from_url` to stream remote Cloudflare CDN MP3s directly to FFmpeg with seek support (`-ss`) without downloading or proxying. Injected a browser `User-Agent` into FFmpeg stream options to bypass Cloudflare anti-bot 403 Forbidden blocks.
- **Dual Reciter Directory with Interactive Arrow Pagination (`!reciters`)**: Split directory listings into two separate Discord messages below the 2000-character limit with `◀️ Previous` and `Next ▶️` button navigation (Message 1: Quran Foundation, Message 2: Quran Central).
- **Full Surah & Radio Playback**: Supported `!quran <surah> full [reciter]` and `!quran radio [reciter]` with both Quran Foundation and Quran Central reciter IDs. Added informative guidance for verse-range commands (`Verse-range playback is not available for Quran Central reciters. Use !quran <surah> full A# instead`).
- **In-Memory Feed TTL Caching**: Feed XML parsing and surah-to-audio mappings are cached in-memory with an 8-hour TTL and asynchronous locks to prevent redundant network traffic.

### v2.1.1 (Quran Radio Rapid-Fail Circuit Breaker & Anti-Cascade Rate Limit Shield)
- **Rapid Stream Failure Circuit Breaker**: Introduced `playback_rapid_fails` tracking in `play_next_after`. If an audio stream finishes within 3 seconds or reads under 384,000 bytes of audio, it is classified as a premature failure. The bot introduces an asynchronous backoff pause (2.0s) between track switches and halts the queue entirely after 3 consecutive failures to avoid endless retries.
- **Eliminated Discord HTTP 429 Channel Rate Limiting**: Completely eliminated back-to-back Discord message flooding when streams fail on startup. Previously, unthrottled recursive calls to `play_next` rapidly dispatched `Now playing` messages, triggering Discord's 5 messages/5s rate limit.
- **Verified Reciter Catalog Slugs**: Fixed broken RSS feed slugs for reciters `A3` (Abdul Basit: `abdul-basit-abd-us-samad`), `A11` (Abdur Rasheed Sufi: `abdur-rasheed-sufi-soosi`), and `A39` (Noreen Muhammad Siddique: `noreen-muhammad-siddique-al-duri-via-abu-amr`). Verified 100% feed health across all 46 reciters.
- **Voice DNS Resolution Resilience & Exception Shielding**: Added `safe_connect_voice(channel, max_retries=2)` with automated retry on momentary Discord RTC media gateway DNS resolution drops (`ClientConnectorDNSError` on ephemeral `*.discord.media` endpoints). Wrapped voice operations across `!join`, `!quran`, and UI views in defensive exception shields that provide actionable troubleshooting guidance (e.g., switching the voice channel's **Region Override** or flushing DNS) instead of unhandled stack traces.
- **Standalone Binary Sync**: Rebuilt `MakkaLauncher.exe` to package the latest bot engine with FFmpeg browser `User-Agent` headers, rapid failure protection, verified catalog feeds, and voice DNS retry resilience.

---

## Bot Commands

The following commands are available to interact with the bot in Discord.

### Voice & Playback Controls
| Command | Usage | Description | Status |
| :--- | :--- | :--- | :--- |
| `!join` | `!join` | Connects the bot to your current voice channel. | Active |
| `!pause` | `!pause` | Pauses current playback. | Active |
| `!resume` | `!resume` | Resumes paused playback. | Active |
| `!skip` | `!skip` | Skips current track and plays the next in queue. | Active |
| `!stop` | `!stop` | Stops playback and clears the queue. | Active |
| `!leave` | `!leave`| Disconnects the bot from the voice channel. | Active |
| `!play` | `!play <URL>` | Plays audio from a YouTube video or search. | **Deprecated / Disabled** (YouTube blocks bot connections; use `!quran`) |
| `!play live`| `!play live <channel>` | Streams Arabic/Islamic live events natively from YouTube. | **Deprecated / Disabled** |
| `!haram` | `!haram <URL>` | Bypasses the Islamic filter for unverified content. | **Deprecated / Disabled** |

### Quran Recitation
| Command | Usage | Description |
| :--- | :--- | :--- |
| `!surah` | `!surah` | Lists all 114 Surahs and their verse counts in 3-columns to easily find chapters. |
| `!quran` | `!quran <surah> <start> [end] [reciter]` | Plays a range of verses. Examples: `!quran 1 1 7` (Al-Fatihah), `!quran 2 255` (Ayatul Kursi). |
| `!quran full` | `!quran <surah> full [reciter]` | Plays an entire chapter continuously (`[reciter]` accepts Quran Foundation IDs `1-176` or Quran Central IDs `A1-A46`). |
| `!quran radio`| `!quran radio [reciter]`| Unending radio. Automatically queues 10 random chapters endlessly (`[reciter]` accepts IDs `1-176` or `A1-A46`). |
| `!ayah` | `!ayah <surah> <ayah> [reciter]` | Plays a single verse. Example: `!ayah 1 1`. |
| `!reciters`| `!reciters` | Lists available reciters across two messages: Quran Foundation (`1-176`) and Quran Central (`A1-A46`) with interactive `◀️` / `▶️` arrow buttons. |
| `!translate`| `!translate <surah> <ayah> [lang]` | Shows translation, Uthmani Arabic text, and includes a Play Audio button. Example: `!translate 1 1 fr` (First verse in French). |
| `!daily` | `!daily`| Shows a random Quran verse, a random Hadith (Abu Dawud), and a button for Tafsir Ibn Kathir. |
| `!close_bot`| `!close_bot`| Safely shuts down the active Master instance and triggers the failover to Standby. |

---

## Technical Features

### Concurrency Control (Heartbeat & Failover)
To ensure 100% uptime and prevent API conflicts, the bot uses a decentralized failover system:
1. **Handshake**: On startup, the instance checks for an active Master. If found, it enters **Standby Mode**.
2. **Master Announcement**: Upon becoming Master (at startup or via failover), the instance sends a one-time message: `👑 Makka Master: Instance [SID:...] is now ACTIVE.`
3. **Heartbeat**: The Master instance sends a background heartbeat `💓 [HB:...]` every 20 seconds using ZLib compression and Base64 encoding. It embeds not only the upcoming queue context, but specifically traces and counts elapsed FFMPEG PCM processing bytes to calculate precise stream timestamps (seconds elapsed) to securely pass to Standbys!
4. **Promotion & Resumption**: If no heartbeat is received for 35 seconds, or if a "Shutting Down" signal is detected, a Standby instance parses the last heartbeat's Base64 queue, injects `-ss` to precisely fast-forward the new stream to the specific second the Master disconnected, and promotes itself to **Master** seamlessly.

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
- **Reciter Selection**: Users can choose from hundreds of reciters via ID for `!quran` and `!ayah`.
- **Rich Translations**: `!translate` displays the original Uthmani Arabic text along with localized translations and Surah names.
- **Interactive Navigation**: Uses `discord.ui.View` with buttons to allow stateful navigation between verses and inline audio playback.
- **Audio Delivery**: Direct MP3 streaming via FFmpeg bypasses local download overhead for instant playback.

### Islamic Content Filtering Logic
To maintain the focus of the server, the bot implements a two-stage filter:
1. **Halal Keywords**: Searches title for extensive Islamic terms, concepts, practices, and Arabic text.
2. **Haram Keywords**: Explicitly blocks terms related to secular music, explicit content, gambling, and superstitions.
3. **Bypass Protocol**: The `!haram` command allows playing unverified content but triggers a moderator alert with the user's name and content link. Users are blocked from using `!haram` to play explicitly Islamic content in order to enforce correct command usage.

### Message Routing Logic
To maintain server cleanliness, the bot uses a priority system for notifications:
1. Searches for any channel containing "spam" or "bot" in the name.
2. If none exist, it targets the Text-In-Voice channel of the user who triggered the command.
3. Final fallback to the server's System Channel or first writable text channel.

---

## Known Issues & Fixes

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| **FFmpeg Not Found** | System PATH not configured. | Integrated `static-ffmpeg` and bundled binaries into EXE (with fallback for raw script). |
| **Duplicate Processes** | Multiple people running EXE. | **Handshake Lock**: Instances auto-negotiate who stays active based on login order. |
| **Source Exposure** | Sharing Python files reveals tokens. | Implemented PyInstaller with `--add-data` to hide files in binary. |
| **Port Conflict** | Launcher opened twice on one PC. | Added port-in-use detection in `server.py` with custom error prompts. |
| **OpusNotLoaded** | PyInstaller stripped Opus DLLs. | Updated `build_launcher.py` to bundle the `discord/bin` directory. |
| **Discord Voice 4017** | Discord enforced DAVE (E2EE) on Mar 1, 2026. | **Required Upgrade**: Upgrade to `discord.py[voice]>=2.7.0`. Requires Rust toolchain for the `davey` dependency. |
| **PyNaCl Missing in EXE** | `nacl` native binaries not auto-detected. | Explicitly collected `nacl._sodium.pyd` and hidden imports in PyInstaller. |
| **Discord HTTP 429 Rate Limit** | Rapid stream failures cycling queue without throttle. | Added rapid failure circuit breaker in `play_next_after` with backoff pause and 3-strike queue halt. |
| **Discord Voice DNS Error (`getaddrinfo failed`)** | Local ISP DNS failure resolving ephemeral regional Discord RTC media gateway hostnames (`c-sin*.discord.media`). | Implemented `safe_connect_voice` with automated retry, exception shields on voice commands, and user guidance to switch the voice channel's **Region Override** (⚙️ ➔ Overview ➔ Region Override) or flush DNS (`ipconfig /flushdns`). |
