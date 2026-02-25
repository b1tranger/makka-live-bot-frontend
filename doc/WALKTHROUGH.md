# Makka Bot | User Walkthrough

Welcome to the Makka Live Bot control center! This guide will help you set up and run the bot on any computer using our secure launcher system.

## 🚀 Setup Guide

### 1. Preparation
- **For the Developer**: Run `python build_launcher.py`. This generates `dist/MakkaLauncher.exe`.
- **For the User**: Download `MakkaLauncher.exe` from the link provided on the web dashboard.

### 2. Launching the "Engine"
1. Double-click `MakkaLauncher.exe` on the computer that will host the bot.
2. A window will open (you can minimize this, but **do not close it**).
3. The engine is now waiting for commands from the dashboard.

### 3. Using the Web Dashboard
1. Open the [Makka Control Website].
2. In the "Backend Bridge URL" field, ensure it says `http://localhost:8000` (if running on the same PC) or the provided server IP.
3. Click the **"Start Bot"** button.
4. Wait for the status indicator to turn **Green (Running)**.

---

## 🎧 Controlling the Bot

### Inviting the Bot
The **"Add Bot to Discord"** link is always available on the dashboard. Click it at any time to authorize the bot for your server.

### Voice Commands
In your Discord server, use the following commands:

- `!join` : Tells the bot to join your current voice channel.
- `!play <URL>` : Streams music from a YouTube video URL.
- `!stop` or `!leave` : Disconnects the bot from voice.

### Turning Off
When you are finished, click **"Stop Bot"** on the web dashboard to release resources, and you can then close the `MakkaLauncher.exe` window.

---

## 🛠️ Troubleshooting
- **Dashboard says "Connection Error"**: Make sure `MakkaLauncher.exe` is actually running and your Firewall isn't blocking port 8000.
- **Bot is online but silent**: Ensure the hosting computer has a stable internet connection for streaming audio.
- **Commands not working**: Check that the Bot has "Message Content Intent" enabled in the Discord Developer Portal.
