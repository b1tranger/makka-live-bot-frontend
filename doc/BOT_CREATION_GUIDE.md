# Discord YouTube Audio Bot | Bot Creation Guide

This guide explains the project structure, how to create and configure your own Discord bot, and how to verify everything works.

## Project Structure
- `requirements.txt`: Contains all necessary Python packages, including `discord.py[voice]>=2.7.0`, `yt-dlp`, `aiohttp`, `PyNaCl`, and `static-ffmpeg`.
- `bot.py`: The main bot implementation with commands for music, Quran recitation, failover, and Islamic content filtering.
- `.env.template`: Template for your Quran API credentials.
- `server.py`: FastAPI bridge server that exposes the bot controls to the web dashboard.
- `build_launcher.py`: PyInstaller build script for creating the standalone `MakkaLauncher.exe`.

## Prerequisites
- **Python 3.10+**
- **Rust/Cargo Toolchain**: Required to compile the `davey` encryption library for Discord Voice E2EE (DAVE protocol).

## How to Set Up

1. **Create a Discord Application**:
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications).
   - Click **"New Application"**, give it a name, and confirm.
   - Navigate to the **"Bot"** section and click **"Add Bot"**.
   - Under **Privileged Gateway Intents**, enable **Message Content Intent**.

2. **Configure the Environment**:
   - Copy `.env.template` to `.env`.
   - Optionally add `QURAN_CLIENT_ID` and `QURAN_CLIENT_SECRET` for Quran Foundation API access.

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Bot (Development)**:
   - Execute `python bot.py`.
   - On the first run, `static-ffmpeg` will automatically download the FFmpeg binaries.

5. **Build the Launcher (Production)**:
   - Run `python build_launcher.py` to create `MakkaLauncher.exe`.
   - The build bundles FFmpeg, Opus DLLs, and the `davey` library into a single executable.

## How to Verify

1. **Discord Interaction**:
   - Invite the bot to your server using the OAuth2 URL from the Developer Portal (ensure `bot` and `applications.commands` scopes are selected, with appropriate permissions).
   - Join a voice channel.
   - Type `!join` to bring the bot in.
   - Type `!play <youtube_link>` to test audio streaming.
   - Type `!play live` to test live quran recitation.
   - Type `!quran 1 1 7` to test Quran recitation.
   - Type `!stop` to stop playback, or `!leave` to disconnect.

2. **Failover Test**:
   - Run two instances of the launcher simultaneously.
   - The first should become **Master**, the second enters **Standby**.
   - Close the Master instance — the Standby should automatically promote and resume playback.

## Key Features Implemented
- **Zero-Manual FFmpeg Setup**: PyInstaller compilation automatically bundles standalone FFmpeg binaries directly into the output executable, while raw Python executions fall back cleanly to `static-ffmpeg`.
- **YouTube Live Support**: `yt-dlp` is configured to stream live content directly.
- **Robust Reconnection**: FFmpeg options are set to handle stream drops and reconnections.
- **Islamic Content Filtering**: `!play` validates video titles against a curated keyword list; 
<!-- `!haram` provides a logged bypass. -->
- **Quran Integration**: Full suite of recitation, translation, and radio commands powered by the Quran Foundation API.
- **Master-Standby Failover**: Decentralized heartbeat system with byte-accurate state transfer for seamless instance transitions.
- **DAVE Protocol Support**: `discord.py` v2.7.0+ with mandatory Discord Voice E2EE.
