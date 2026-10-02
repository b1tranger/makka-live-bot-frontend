# Makka Live Bot Documentation

Welcome to the documentation for the Makka Live Bot project. This directory contains detailed guides, technical specifications, and release notes for the system.

## Table of Contents

1.  **[Technical Documentation](DOCUMENTATION.md)**
    *   System architecture, tech stack, complete version history (v1.0.0 through v2.0.0), active bot commands, and known issues.
2.  **[History & Changelog](history.md)**
    *   Chronological record of updates, feature releases, and fixes.
3.  **[User Walkthrough](WALKTHROUGH.md)**
    *   Step-by-step guide on how to set up and use the bot and dashboard, including the full command reference.
4.  **[Bot Creation Guide](BOT_CREATION_GUIDE.md)**
    *   Instructions on how to create the Discord bot from scratch, configure the environment, and verify the setup.

---

## Project Purpose
Makka Live Bot is a specialized Discord audio bot designed for high-quality, pure Islamic audio and Quran recitation streaming powered directly by the Quran Foundation API. It features a unique "Remote Control" architecture that allows users to host the bot on their local machines while controlling it via a centralized web dashboard.

## Key Highlights
- **Pure Quran Foundation API Streaming (v2.0.0)**: High-fidelity MP3 recitation across all 114 Surahs and hundreds of reciters. Legacy YouTube playback commands are deprecated/disabled due to platform anti-bot barriers.
- **In-Dashboard Changelog Modal (v2.0.0)**: Real-time What's New modal powered by `changes.json` with fallback support and version badge pills.
- **Master-Standby Failover**: Decentralized architecture ensures 100% uptime with byte-accurate state transfer between instances.
- **Quran Integration**: Full suite of recitation, translation, radio mode, and daily verse commands powered by the Quran Foundation API.
- **DAVE Protocol**: Supports Discord's mandatory Voice End-to-End Encryption via `discord.py` v2.7.0+.
- **Cross-Platform**: Available as `MakkaLauncher.exe` (Windows) and `MakkaLauncher-Android` (Termux/ARM64).
