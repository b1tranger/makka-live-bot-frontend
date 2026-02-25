# Discord YouTube Audio Bot Walkthrough

This guide explains how the Discord bot project was created and how to set it up for the first time.

## Project Structure
- `requirements.txt`: Contains all necessary Python packages, including `static-ffmpeg` for automatic binary handling.
- `bot.py`: The main bot implementation with commands for joining, playing (including live streams), and stopping.
- `.env.template`: Template for your Discord token.
- `README.md`: Comprehensive guide for setup and the Discord Developer Portal.

## How to Verify

1. **Setup Environment**:
   - Create a `.env` file and add your Discord bot token.
   - Run `pip install -r requirements.txt`.

2. **Run the Bot**:
   - Execute `python bot.py`.
   - On the first run, watch the terminal as it downloads the FFmpeg binaries automatically.

3. **Discord Interaction**:
   - Invite the bot to your server (ensure intents are enabled in the Developer Portal).
   - Join a voice channel.
   - Type `!join` to bring the bot in.
   - Type `!play <youtube_link>`.
   - Type `!stop` to disconnect.

## Key Features Implemented
- **Zero-Manual FFmpeg Setup**: Using `static-ffmpeg` eliminates the need for users to install FFmpeg manually.
- **YouTube Live Support**: `yt-dlp` is configured to stream live content directly.
- **Robust Reconnection**: FFmpeg options are set to handle stream drops and reconnections.
