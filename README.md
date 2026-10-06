# LA MAIN DE DIEU — MORNINGSTAR

**ELOHIM — THE ETERNAL**

WhatsApp bot based on a clean X-Asena (Baileys 7) engine, rebuilt for **Termux / Android** as primary runtime.

- No Render / cloud dependency required  
- No PostgreSQL / Sequelize  
- No better-sqlite3 (native) for auth  
- Session = multi-file (pure JS)  
- Settings = JSON BotKV  

Official channel: https://whatsapp.com/channel/0029Vb8q4Nb1Hsq6YCQlw33u

---

## Requirements

- Node.js **20+**
- FFmpeg on `PATH` (for `#ytmp3`, `#play`, `#tomp3`, video stickers, `#attp`)
- WhatsApp multi-device account

### Termux packages

```bash
pkg update && pkg upgrade
pkg install nodejs-lts ffmpeg git python
# optional (stickers quality): may need extra steps for sharp
```

---

## Install

```bash
git clone https://github.com/auraconfortstudio-beep/La-Main-de-Dieu.git
cd La-Main-de-Dieu
cp .env.example .env
# edit OWNER_NUMBER in .env
npm install
npm start
```

### Login

1. **QR (default)** — scan terminal QR with WhatsApp → Linked devices  
2. **Pairing code** — set `PAIRING_NUMBER` (digits + country code), restart, enter code on phone  

Session lives in `./session/` (persists across Termux restarts if the directory is kept).

---

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `OWNER_NUMBER` | _(empty)_ | Owner phone(s), country code, no `+` |
| `SUDO` | _(empty)_ | Extra privileged numbers |
| `BOT_MODE` | `public` | First-boot: `public` \| `private` |
| `BOT_LANG` | `en` | `en` \| `id` \| `hi` |
| `SESSION_DIR` | `./session` | Multi-file auth directory |
| `KV_PATH` | `./data/botkv.json` | Bot settings JSON |
| `PAIRING_NUMBER` | _(empty)_ | Pairing-code login |
| `STICKER_PACKNAME` | `MORNINGSTAR` | Sticker pack name |
| `STICKER_AUTHOR` | `ELOHIM — THE ETERNAL` | Sticker author |
| `REMOVEBG_API_KEY` | _(empty)_ | `#removebg` |
| `LOG_LEVEL` | `warn` | App log level |
| `BAILEYS_LOG_LEVEL` | `silent` | Baileys log level |

---

## Termux

See **[TERMUX.md](TERMUX.md)** for wake-lock, Termux:Boot, watchdog, backup, and restart.

Quick start:

```bash
termux-wake-lock
npm start
# or
bash scripts/termux-start.sh
```

---

## Features (engine)

- Baileys 7 connection + QR / pairing  
- Auto-reconnect with exponential backoff  
- Plugins: menu, moderation, stickers, YouTube, social DL, notes, reminders, polls…  
- Owner / sudo / public-private mode  
- System log group + onboarding  
- Graceful SIGTERM / SIGINT  
- Session backup script  

Prefix: `#` — try `#menu`.

---

## License

MIT (upstream X-Asena lineage). Branding: La Main de Dieu — MORNINGSTAR.
