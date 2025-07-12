# 🎮 GameCompass

**GameCompass** ist eine moderne Webplattform zur Organisation, Bewertung und Vorstellung von Spielen. Sie besteht aus einem Vite/React-Frontend und einem Node.js/Express-Backend mit MongoDB als Datenbank.

---

## 📁 Projektstruktur

```
.
├── frontend/          # React + Vite + TypeScript
├── backend/           # Node.js + Express API
└── database/          # MongoDB-Anbindung (lokal oder Docker)
```

---

## 🚀 Lokale Entwicklung starten

Öffne zwei Terminal-Tabs oder nutze `tmux`/`zellij`:

### 🔹 Tab 1 – Frontend (Vite + HMR)
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### 🔹 Tab 2 – Backend (API mit Express)
```bash
cd backend
npm install
npm start          # http://localhost:3000
```

Das Frontend konsumiert API-Requests automatisch von `VITE_API_BASE_URL`, siehe `.env.local`.

---

## 🗄️ Erste Datenbank anlegen (lokal mit mongosh)

```bash
mongosh
> use GameCompass
> db.users.insertOne({ username: "test", email: "test@example.com" })
> show collections
> db.users.find().pretty()
```

---

## 🐳 MongoDB mit Docker starten (optional)

```bash
docker run -d --name gamecompass-mongo -p 27017:27017 mongo:latest
```

---

## 🔧 .env-Dateien

### frontend/.env.local
```env
VITE_API_BASE_URL=http://localhost:3000
```

### backend/.env
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/GameCompass
```

---

## 🧪 Technologien

- **Frontend**: React, TypeScript, Vite, Axios, Bootstrap
- **Backend**: Node.js, Express
- **Datenbank**: MongoDB (lokal oder Container)
- **Entwicklung**: Git, Docker, ESLint, Prettier

---

## ✅ Git-Workflow (kurz)

```bash
git pull origin main
# Code schreiben, Änderungen committen
git add .
git commit -m "feat: neue Funktion xy"
git push origin main
```

> Für komplexere Workflows siehe Wiki → Git-Strategie

---

## 📦 TypeScript & React Version prüfen

```bash
npx tsc --version
npm list react react-dom --depth=0
```

---

# 🕹️ RAWG API Integration

### .env

    
    RAWG_API_KEY=dein_rawg_api_schluessel
    RAWG_BASE_URL=https://api.rawg.io/api
    
### bash

    
    curl -X POST http://localhost:3000/api/games/import-rawg

    oder 

    curl -k -X POST https://localhost:3000/api/games/import-rawg

    oder

    Invoke-RestMethod -Uri "https://localhost:3000/api/games/import-rawg" -Method Post



 >Es ist wichtig, dass die `.env` Datei korrekt geladen wird, damit der API-Schlüssel an den Server weitergegeben wird.

 ---

# 🧾 Datenquelle

Dieses Projekt nutzt die [RAWG Video Games Database API](https://rawg.io/apidocs) für die Anzeige von Spieledaten.
Alle Spieledaten stammen von RAWG. Dieses Projekt ist nicht-kommerziell und dient ausschließlich zu Lernzwecken im Rahmen einer Universitätsveranstaltung.

 ---

## 👥 Team

- Enes – Teamleader / FullStack Developer
- Rojdi – Backend Developer
- Abdullah – Frontend Developer (Funktionalität)
- Adem – Frontend Developer (CSS & HTML)
- Ensar – Frontend Developer / Designer
- Kaan – Frontend Developer / Scrum Master

---

## 📝 Lizenz

MIT – Feel free to fork, build and share.

## Installation

1. Clone das Repository
2. Führe `npm install` im Backend- und Frontend-Verzeichnis aus
3. Initialisiere die Datenbank: `cd Backend && npm run init-db`
4. Starte die Anwendung: `npm start`



syncToChroma.ts Script ausführen:

cd Backend
npx ts-node scripts/syncToChroma.ts

Prompts erstellen:

cd Backend
npx tsx scripts/setupPrompts.ts




# 1. Repository clonen
git clone <dein-repo>
cd GameCompass

# 2. Backend Dependencies
cd Backend
npm install

# 3. Chroma-Server starten (Docker)
docker run -p 8000:8000 ghcr.io/chroma-core/chroma:latest

# 4. In neuem Terminal: Spiele zu Chroma synchronisieren
cd Backend
npx ts-node scripts/syncToChroma.ts

# 5. Backend starten
npm run dev

# 6. Frontend starten (neues Terminal)
cd ../frontend
npm install
npm run dev


Abchecken ob Docker läuft:

cd Backend

docker ps | findstr chroma
