# Termux — MORNINGSTAR

## 1. Installation

```bash
pkg update && pkg upgrade -y
pkg install nodejs-lts ffmpeg git python clang make -y
# clone or extract the project
cd La-Main-de-Dieu   # or morningstar folder
cp .env.example .env
nano .env            # set OWNER_NUMBER
npm install
```

**Note on `sharp`:** optional dependency for high-quality stickers. If install fails on Android, stickers that need sharp may degrade or fail; core bot still runs. You can retry with `npm install sharp --build-from-source` after installing build tools.

## 2. Configuration

Edit `.env`:

```env
OWNER_NUMBER=225XXXXXXXXX
BOT_MODE=public
SESSION_DIR=./session
KV_PATH=./data/botkv.json
```

## 3. Start

```bash
termux-wake-lock
npm start
```

Or:

```bash
bash scripts/termux-start.sh
```

## 4. WhatsApp login

- Scan QR, or set `PAIRING_NUMBER` and use the code shown in the terminal.
- Session files appear under `./session/`. Keep this folder to stay logged in.

## 5. Auto-start (Termux:Boot)

1. Install **Termux:Boot** from F-Droid.  
2. Create `~/.termux/boot/morningstar.sh`:

```bash
#!/data/data/com.termux/files/usr/bin/bash
termux-wake-lock
cd /data/data/com.termux/files/home/La-Main-de-Dieu
npm start >> logs/boot.log 2>&1
```

```bash
mkdir -p ~/.termux/boot logs
chmod +x ~/.termux/boot/morningstar.sh
```

## 6. Watchdog (simple loop)

```bash
# scripts/watchdog.sh
while true; do
  termux-wake-lock || true
  node index.js
  echo "Process exited — restart in 5s"
  sleep 5
done
```

Android can still kill the process under memory pressure; wake-lock + Boot reduce that risk but do not guarantee 24/7.

## 7. Stop

- Terminal: `Ctrl+C` (SIGINT) or send SIGTERM  
- Commands in TTY: `Q` logout, `R` restart, `A` wipe session  

## 8. Restart

```bash
# after stop
npm start
# or type R + Enter in the bot TTY
```

## 9. Backup session

```bash
npm run backup-session
# creates ./backups/session-backup-*.tar.gz
```

Restore: extract over `./session` and `./data` then `npm start`.

## 10. Important paths

| Path | Role |
|------|------|
| `./session/` | WhatsApp credentials (do not commit) |
| `./data/botkv.json` | mode, sudo, stickers, lang |
| `./.env` | secrets / owner |
| `./backups/` | session archives |
