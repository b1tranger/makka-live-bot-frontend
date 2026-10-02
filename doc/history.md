<!--
tags: [changelog, release-notes, history, version-tracking, frontend]
project: makka-live-bot-frontend
last_updated: 02.10.26
-->

# 02.10.26
- **v2.0.1 — Quran Radio Pause/Resume Stream Resilience & Queue Burnout Guard (`changes.json`, `changelog-modal.js`, `index.html`, `doc/`)**:
  - **Intelligent Stream Resumption**: Integrated precise playback offset persistence (`bytes_read / 192000.0`) and automatic `-ss` fast-forward restarting on `!resume`, ensuring audio seamlessly resumes even if remote CDN HTTP connections reset during pauses.
  - **Connection Resilience**: Implemented strict voice client connectivity checks to eliminate recursive queue purge loops and API auto-refill thrashing.
  - **Channel Switching & Cleaner Logs**: Updated `!join` to seamlessly move between voice channels without client exceptions and suppressed expected 404 notifications during randomized radio prefetching.

# 30.09.26
- **v2.0.0 — Pure Quran Foundation API Streaming & In-Dashboard Changelog Modal (`changes.json`, `changelog-modal.js`, `index.html`, `style.css`, `doc/`)**:
  - **Interactive What's New Modal**: Added a glassmorphism changelog modal to the web dashboard powered by [`changes.json`](../changes.json) and [`changelog-modal.js`](../changelog-modal.js). Features include automatic first-time display for new releases, `localStorage` dismissal state (`makka_live_last_version`), tag-based change pills, expandable older version history accordion, and robust offline fallback for `file:///` browsing.
  - **Floating Desktop Trigger**: Added a bottom-left floating launcher button (`.changelog-desktop-btn`) with version badge pill (`v2.0.0`) allowing users to easily open the changelog at any time.
  - **Quran Foundation API Audio Focus**: Highlighted the transition to high-fidelity direct MP3 streaming from the Quran Foundation API (`api.quran.com`) and updated command guides to reflect the deprecation of YouTube playback commands (`!play`, `!play live`, `!haram`).
  - **Documentation & Standards**: Synchronized client documentation in [`doc/DOCUMENTATION.md`](DOCUMENTATION.md) and [`doc/README.md`](README.md).

# 17.07.26
- **v1.9.2 — Filter Expansion & PyNaCl Executable Support (`doc/DOCUMENTATION.md`)**:
  - **Content Verification Upgrade**: Expanded Halal/Haram verification keywords with extensive Arabic terminology and topic checks.
  - **Voice Stability**: Resolved audio voice library loading in packaged executables.
- **v1.9.1 — Discord Voice DAVE Protocol Support (`doc/DOCUMENTATION.md`)**:
  - **Mandatory E2EE Voice**: Updated voice connection architecture to support Discord's mandatory DAVE protocol, eliminating WebSocket 4017 voice termination.
- **v1.9.0 — Continuous Quran Radio & Byte-Accurate Failover (`doc/DOCUMENTATION.md`)**:
  - **Quran Radio**: Added `!quran radio [reciter_id]` allowing non-stop randomized Surahs without interrupting active queues.
  - **Byte-Accurate Playback Transfer**: Implemented stream timestamp tracking ensuring Standby instances resume playback at the exact second a Master disconnected.

# 16.07.26
- **v1.8.1 — Quran API Pagination Fix (`doc/DOCUMENTATION.md`)**:
  - **Full-Surah Pagination Retrieval**: Increased query limits up to 286 verses per request to prevent long chapters from cutting off early.
- **v1.8.0 — Android Termux Launcher & 3-Column Surah List (`doc/DOCUMENTATION.md`)**:
  - **Android Deployment**: Added ARM64 Linux launcher script (`MakkaLauncher-Android`) for Termux.
  - **3-Column Surah Format**: Optimized chapter display into clean 3-column Discord embeds.

# 15.07.26
- **v1.7.0 — Content Filtering & Quran Foundation API Upgrade (`doc/DOCUMENTATION.md`)**:
  - **Content Safety**: Introduced keyword filtering to safeguard Islamic audio focus.
  - **Quran Foundation Migration**: Transitioned recitation queries to the Quran Foundation API.
- **v1.6.0 — Decentralized Master-Standby Failover System (`doc/DOCUMENTATION.md`)**:
  - **High Availability**: Added automated Master-Standby failover with periodic heartbeats for zero-downtime streaming.

# 14.07.26
- **v1.5.0 — Quran Integration & Interactive Navigators (`doc/DOCUMENTATION.md`)**:
  - **Interactive Recitation**: Added `!quran`, `!ayah`, `!reciters`, and `!translate` commands with Discord UI buttons for flipping through translations and playing audio.
- **v1.4.0 — Local Control Bridge & Dashboard UX (`app.js`, `index.html`, `style.css`)**:
  - **Dual Hosting UX**: Separated dashboard into Remote and Local hosting controls.
  - **Embedded FAQ**: Added collapsible FAQ accordion and dynamic footer scripts.

# 12.07.26
- **v1.0.0 — Initial Release (`app.js`, `index.html`)**:
  - Launch of the Makka Live Bot control dashboard with real-time status indicators and bot control endpoints.
