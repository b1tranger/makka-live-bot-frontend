# Makka Bot | User Walkthrough

Welcome to the Makka Live Bot control center! This guide will help you set up and run the bot on any computer using our launcher system.

## 🚀 Setup Guide

### 1. Preparation
- **Windows Deployment**: Download `MakkaLauncher.exe` from the link provided on the web dashboard.
- **Android Deployment (Termux)**: Open Termux, download the `MakkaLauncher-Android` binary (refer to the dashboard instructions), and grant it executable permissions (`chmod +x MakkaLauncher-Android`).

### 2. Launching the "Engine"
1. **On Windows**: Double-click `MakkaLauncher.exe`. A terminal window will open (do not close it).
2. **On Android**: Execute `./MakkaLauncher-Android` in the Termux terminal. Keep Termux running.
3. The engine is now connected to Discord and waiting for remote operations.

### 3. Using the Web Dashboard
1. Open the [Makka Control Website].
2. In the "Backend Bridge URL" field, ensure it says `http://localhost:8000` (if running on the same PC) or the provided server IP.
3. Click the **"Start Bot"** button.
4. Wait for the status indicator to turn **Green (Running)**.

---

## 🎧 Controlling the Bot

### Inviting the Bot
The **"Add Bot to Discord"** link is always available on the dashboard. Click it at any time to authorize the bot for your server.

### Music & Media Commands
In your Discord server, use the following commands:

| Command | Description |
| :--- | :--- |
| `!join` | Connects the bot to your current voice channel. |
| `!play <URL>` | Streams audio from a YouTube video or search (Islamic content only). |
| `!play live` | Plays live quran recitation. |
<!-- | `!haram <URL>` | Bypasses the Islamic filter (usage is logged for moderators). | -->
| `!pause` | Pauses the current playback. |
| `!resume` | Resumes a paused playback. |
| `!skip` | Skips the current track and plays the next in queue. |
| `!stop` | Stops playback and clears the queue. |
| `!leave` | Disconnects the bot from the voice channel. |

### Quran Recitation Commands

| Command | Description |
| :--- | :--- |
| `!surah` | Lists all 114 Surahs and their verse counts to easily find chapters. |
| `!quran <surah> <start> [end] [reciter]` | Plays a range of verses. Example: `!quran 1 1 7` for Al-Fatihah. |
| `!quran <surah> full [reciter]` | Plays an entire chapter continuously. |
| `!quran radio [reciter]` | Enters endless radio mode — automatically queues randomized Surahs. |
| `!ayah <surah> <ayah> [reciter]` | Plays a single verse. Example: `!ayah 1 1`. |
| `!reciters` | Lists the top 20 available reciter IDs. |
| `!translate <surah> <ayah> [lang]` | Shows translation, Arabic text, and a Play Audio button. Example: `!translate 1 1 fr`. |
| `!daily` | Shows a random Quran verse, a Hadith, and a button for Tafsir Ibn Kathir. |

### Turning Off
When you are finished, click **"Stop Bot"** on the web dashboard to release resources, and you can then close the `MakkaLauncher.exe` window.

---

## 🔄 Failover & Reliability

The bot uses a **Master-Standby** architecture for maximum uptime:
- **Multiple instances** can run simultaneously. The first becomes Master; others enter Standby.
- If the Master goes offline, a Standby instance **automatically promotes** itself and resumes playback from the exact second the Master stopped.
- You don't need to do anything — the failover is fully automatic and seamless.

---

## 🛠️ Troubleshooting

| Problem | Solution |
| :--- | :--- |
| **Dashboard says "Connection Error"** | Make sure `MakkaLauncher.exe` is actually running and your Firewall isn't blocking port 8000. |
| **Bot is online but silent** | Ensure the hosting computer has a stable internet connection for streaming audio. |
| **Commands not working** | Check that the Bot has "Message Content Intent" enabled in the Discord Developer Portal. |
| **Voice disconnects (4017 error)** | Ensure you are using the latest `MakkaLauncher.exe` build with DAVE (E2EE) support (discord.py v2.7.0+). |
