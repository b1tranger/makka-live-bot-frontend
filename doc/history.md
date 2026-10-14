<!--
tags: [changelog, release-notes, history, architecture, version-tracking]
project: makka-live-bot-frontend
last_updated: 14.10.26
-->

# 14.10.26
- **v2.1.1 — Quran Radio Fast-Fail Circuit Breaker, Anti-Cascade Rate Limit Shield & Verified Reciter Feeds (`bot.py`, `quran_central.py`, `dist/MakkaLauncher.exe`, `doc/DOCUMENTATION.md`, `README.md`, `frontend/changes.json`, `frontend/changelog-modal.js`, `frontend/index.html`, `frontend/doc/`)**:
  - **Consecutive Stream Failure Circuit Breaker**: Added `playback_rapid_fails` tracking in `play_next_after`. When an audio stream dies prematurely (< 3.0s elapsed or < 384,000 bytes read), the bot records a rapid failure and inserts an asynchronous backoff pause (`await asyncio.sleep(2.0)`). If 3 consecutive rapid failures occur, the bot halts playback, unsets `radio_modes`, clears the guild queue, and sends a single friendly alert (`⚠️ Playback halted: Multiple consecutive audio streams failed to connect...`), stopping runaway recursive retry loops.
  - **Eliminated Discord HTTP 429 Channel Rate Limiting**: Completely eliminated back-to-back Discord message dispatching on failed audio tracks. Previously, when FFmpeg terminated on startup, `play_next_after` immediately called `play_next` without throttling, burning through 10 queued tracks in milliseconds and hitting Discord's 5 messages/5s channel rate limit (`POST responded with 429`).
  - **Quran Central Catalog Slug Inaccuracies Corrected**: Fixed broken/404 podcast RSS feed slugs for reciters `A3` (Abdul Basit: `abdul-basit-abd-us-samad`), `A11` (Abdur Rasheed Sufi: `abdur-rasheed-sufi-soosi`), and `A39` (Noreen Muhammad Siddique: `noreen-muhammad-siddique-al-duri-via-abu-amr`). Verified 100% feed health (46/46 reciters returning HTTP 200).
  - **Voice DNS Resolution Resilience & Exception Shielding**: Implemented `safe_connect_voice(channel, max_retries=2)` with automated retry on momentary Discord RTC media gateway DNS resolution drops (`ClientConnectorDNSError`). Wrapped voice connection flows across `!join`, `!quran`, and interactive playback buttons with user-friendly troubleshooting alerts (directing users to Discord's **Region Override** or DNS flushing) rather than throwing raw tracebacks.
  - **Standalone Binary Sync & Rebuild (`dist/MakkaLauncher.exe`)**: Recompiled `MakkaLauncher.exe` to incorporate the latest bot engine with FFmpeg browser `User-Agent` headers, rapid failure protection, verified catalog feeds, and voice DNS retry resilience.

# 02.10.26
- **v2.1.0 — Quran Central RSS Audio Provider, Dual Reciter Namespace & Direct Remote MP3 Streaming (`quran_central.py`, `bot.py`, `tests/test_quran_central.py`, `doc/DOCUMENTATION.md`, `README.md`, `frontend/changes.json`, `frontend/changelog-modal.js`, `frontend/index.html`, `frontend/doc/`)**:
  - **Modular `QuranCentralProvider` Service**: Integrated `qurancentral.com` as a secondary audio provider alongside Quran Foundation. Built asynchronous RSS fetching and XML parsing (`xml.etree.ElementTree`) extracting enclosure URLs directly from podcast feeds (`https://rss.qurancentral.com/{slug}.rss`).
  - **Unambiguous `A#` Reciter Namespace & Expanded Catalog**: Established canonical `A#` IDs (`A1` to `A46`) for Quran Central reciters (e.g., `A1` maps to Ibi Idris) with slug fallback resolution, completely eliminating naming and ID collisions with numeric Quran Foundation reciters (`1` to `176`).
  - **Direct Remote Audio Streaming**: Added `qurancentral.com` to `YTDLSource.from_url` direct audio whitelist, allowing Cloudflare CDN-backed podcast MP3s to stream directly into FFmpeg with seeking support (`-ss`) without downloading or caching audio files on local disk.
  - **Dual Provider Reciter Directory with Interactive Arrow Pagination (`!reciters`)**: Split `!reciters` output into two separate embed messages below Discord's 2000-character limit: Message 1 for Quran.com / Quran Foundation reciters and Message 2 for Quran Central reciters (`A1` to `A46` IDs and names) with interactive `◀️ Previous` and `Next ▶️` button navigation.
  - **Unified `!quran` Command Integration**: Supported both namespaces seamlessly across `!quran <surah> full [reciter]` and `!quran radio [reciter]`. Added defensive verse-range validation informing users that Quran Central reciters provide full-surah audio only.
  - **In-Memory Feed TTL Caching**: Implemented in-memory caching with an 8-hour TTL and asynchronous locks to minimize external network requests to Quran Central while keeping feeds fresh.
  - **Standalone Binary Packaging Fix**: Bundled `quran_central.py` as an embedded data asset and hidden import in PyInstaller build scripts for Windows and Android Termux, ensuring runtime dependencies are discovered in compiled binaries.
  - **FFmpeg Stream Headers & CDN User-Agent Injection**: Added standard browser `User-Agent` to `ffmpeg_options['before_options']`. Cloudflare CDN servers hosting `podcasts.qurancentral.com` return `HTTP 403 Forbidden` when queried by FFmpeg's default user-agent header; adding the browser user-agent resolved immediate stream termination and ensured uninterrupted audio playback and accurate `!pause` / `!resume` state tracking.
  - **Unit Test Suite**: Added test coverage validating XML parsing, surah number extraction, case-insensitive ID resolution, and provider routing across all 46 reciters.

# 02.10.26
- **v2.0.1 — Resilient Quran Radio Pause & Resume Architecture, Queue Burnout Guard & Connection Self-Healing (`bot.py`, `doc/DOCUMENTATION.md`, `README.md`, `frontend/changes.json`, `frontend/changelog-modal.js`, `frontend/index.html`, `frontend/doc/`)**:
  - **Intelligent Pause & Resume with Fast-Forward Fallback**: Engineered intelligent pause and resume tracking with PCM byte-accurate timestamp persistence and `-ss` fast-forward seeking fallback when remote CDN connections reset.
  - **Eliminated Recursive Queue Burnout ("Cascade of Death")**: Added strict connection validation (`ctx.voice_client.is_connected()`) in `play_next`. On voice client disconnection or stream init errors, tracks are preserved at the head of the queue rather than discarded, and consecutive error thresholds halt tight recursive loops to prevent burning the entire queue in milliseconds.
  - **Quran Radio 404 Logging Suppression**: Updated chapter requests with `quiet_404=True` to cleanly bypass unrecorded chapters during randomized radio batches without filling logs with spurious 404 errors.
  - **Self-Healing `!join` Command**: Overhauled `join` to intelligently handle already-connected voice clients, channel moves, and stale or disconnected voice states without throwing exceptions.
  - **Direct Stream yt-dlp Bypass**: Bypassed `yt-dlp` completely for Quran Foundation API and direct CDN audio streams, eliminating unnecessary metadata extraction latency and preventing crashes from browser cookie database file locks.
  - **Active State Tracking**: Added `current_tracks` and `paused_tracks` registry across guilds to track runtime playback state and synchronize cleanup across `skip`, `stop`, and `leave`.
  - **Changelog Modal Script Robustness**: Fixed a JSON formatting syntax error in the offline fallback dictionary within `frontend/changelog-modal.js` and wrapped rendering logic in defensive exception handling.

# 30.09.26
- **v2.0.0 — YouTube Playback Deprecation, Pure Quran Foundation API Streaming Architecture & Frontend Changelog Modal (`bot.py`, `doc/DOCUMENTATION.md`, `README.md`, `AGENTS.md`, `frontend/changes.json`, `frontend/changelog-modal.js`, `frontend/index.html`, `frontend/style.css`, `frontend/doc/`)**:
  - **YouTube Audio Deprecation**: Commented out active execution of `!play`, `!play live`, and `!haram` commands due to YouTube's strict anti-bot and datacenter IP enforcement.
  - **Informed Command Fallback**: Updated `play` and `haram` commands to reply directly with user-friendly notices explaining the YouTube verification barriers and advising users to utilize direct Quran Foundation API commands.
  - **Bot Help Command Refresh**: Overhauled the `!help` embed to reflect the API-first model and removed obsolete YouTube commands.
  - **AGENTS.md Standardization**: Introduced automated prompt archiving, dual-write planning documents, and automated history synchronization across the backend and frontend repositories.
  - **Frontend Changelog Modal Architecture**: Implemented a responsive what's new modal on the web dashboard powered by `frontend/changes.json` and `frontend/changelog-modal.js` with offline fallback data, tag-based change pills, expandable version history accordion, and a floating desktop trigger button.
  - **Documentation & Sync**: Updated technical documentation across both repositories.

# 17.07.26
- **v1.9.2 — Filter Expansion & Standalone PyNaCl Bundling**:
  - **Extensive Halal/Haram Filter Expansion**: Significantly widened content verification filters with broader Arabic scripts and topics.
  - **Executable Voice Fix (PyNaCl)**: Resolved voice connection errors in standalone desktop executables by packaging native sodium binaries and cryptography modules.
- **v1.9.1 — Discord Voice DAVE Protocol (E2EE) & WebSocket Stability**:
  - **Mandatory DAVE Voice Upgrade**: Upgraded to `discord.py[voice]>=2.7.0` supporting Discord's Audio & Video End-to-End Encryption protocol (DAVE) and native `davey` crypto engine.
  - **WebSocket 4017 Close Code Elimination**: Fixed persistent voice connection termination triggered after Discord's mandatory voice encryption deadline.
- **v1.9.0 — Seamless Byte-Accurate Failover & Radio Mode**:
  - **Continuous Quran Radio**: Added `!quran radio [reciter_id]` allowing unending, randomized queueing of Surahs without interrupting active playback.
  - **Byte-Accurate Stream State Handoff**: Embedded FFMPEG PCM byte counters into heartbeats for millisecond-precise resume seeking upon failover.

# 16.07.26
- **v1.8.1 — Quran API Verse Pagination Fix**: Full-surah pagination retrieval up to 286 verses per query.
- **v1.8.0 — Android Termux Launcher & 3-Column Surah Query**: Android ARM64 binary build workflow and 3-column chapter listings.

# 15.07.26
- **v1.7.0 — Content Filtering, Quran Foundation API & Silent Heartbeats**: Verified Islamic audio queries, silent heartbeats, and Quran Foundation API migration.
- **v1.6.0 — Decentralized Master-Standby Failover System**: Distributed redundancy with automated Master-Standby negotiation.

# 14.07.26
- **v1.5.0 — Quran Foundation Integration & Interactive Navigators**: Added verse exploration and priority message routing.
- **v1.4.0 — Local Control Bridge & Dashboard UX**: Segmented dashboard controls, collapsible FAQ accordion, and dynamic footer.

# 12.07.26
- **v1.3.0 — Playlist Queue System & Session Handshake**: Flat-extraction for playlist queues and instance locking.
- **v1.0.0 — Initial Release**: Core Discord bot audio streaming engine and companion web dashboard.
