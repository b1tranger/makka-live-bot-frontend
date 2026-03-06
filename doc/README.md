# Makka Live Bot Documentation

Welcome to the documentation for the Makka Live Bot project. This directory contains detailed guides and technical specifications for the system.

## Table of Contents

1.  **[Technical Documentation](DOCUMENTATION.md)**
    *   System architecture, tech stack, version history (up to v1.9.1), bot commands, and known issues.
2.  **[User Walkthrough](WALKTHROUGH.md)**
    *   Step-by-step guide on how to set up and use the bot and dashboard, including the full command reference.
3.  **[Bot Creation Guide](BOT_CREATION_GUIDE.md)**
    *   Instructions on how to create the Discord bot from scratch, configure the environment, build the launcher, and verify the setup.

---

## Project Purpose
Makka Live Bot is a specialized Discord music bot designed for high-quality audio streaming from YouTube. It features a unique "Remote Control" architecture that allows users to host the bot on their local machines while controlling it via a centralized web dashboard.

## Key Highlights
- **Master-Standby Failover**: Decentralized architecture ensures 100% uptime with byte-accurate state transfer between instances.
- **Quran Integration**: Full suite of recitation, translation, radio mode, and daily verse commands powered by the Quran Foundation API.
- **Islamic Content Filtering**: Values-driven audio filtering with a logged moderation bypass.
- **DAVE Protocol (v1.9.1)**: Supports Discord's mandatory Voice End-to-End Encryption via `discord.py` v2.7.0+.
- **Cross-Platform**: Available as `MakkaLauncher.exe` (Windows) and `MakkaLauncher-Android` (Termux/ARM64).
