# ClearPath

**You think. We coordinate.**

> Every collaboration tool was built for how managers think teams should work.
> ClearPath was built for how humans actually work.

ClearPath eliminates the cognitive overhead of team coordination using **Google Ecosystem + Gemini AI**. It handles scheduling, preparation, follow-up, and task monitoring — so your brain can focus on the actual work.

## ✨ Core Features

| Feature | Description |
|---------|-------------|
| **Pre-Meeting Genie** | AI-generated personalised brief 30 min before every meeting |
| **Post-Meeting Intel** | Paste raw notes → structured action items, owners, deadlines |
| **Smart Help Scheduler** | Natural language → find slot → create Google Meet event |
| **Daily Cognitive Offload** | AI-recommended optimal day pushed to Google Calendar |
| **Gentle Nudge** | Psychologically safe task monitoring — check-in, not follow-up |
| **Ippo Task Intelligence** | Break overwhelming tasks into momentum-friendly steps |

## 🏗 Architecture

```
ClearPath/
├── frontend/           # React 18 + Vite
│   └── src/
│       ├── components/ # Sidebar
│       ├── hooks/      # useAuth (Google OAuth)
│       ├── pages/      # Dashboard, 6 features, Settings
│       └── services/   # API client layer
├── backend/            # Node.js + Express
│   ├── routes/         # auth, meetings, scheduler, nudge, ippo
│   ├── services/       # gemini, googleApis, pubsub
│   └── middleware/     # auth, rateLimiter, sanitize
├── Dockerfile          # Multi-stage build for Cloud Run
└── README.md
```

## 🔌 Google Integrations (12 services)

- Gemini 1.5 Pro — AI intelligence layer (7 prompt functions)
- Google Calendar API — availability, events, scheduling
- Google Docs API — agenda reading, summary creation
- Google Sheets API — task registry, action items
- Google Slides API — slide thumbnails for context
- Google OAuth 2.0 — single sign-on with scoped permissions
- Google Cloud Run — serverless backend hosting
- Google Pub/Sub — calendar event triggers
- Firebase Firestore — real-time team state
- Firebase Cloud Messaging — push notifications
- Google Tasks API — personal task sync
- Google Meet — auto-generated meeting links

## 🚀 Getting Started

### Prerequisites
1. Create a GCP project
2. Enable: Calendar, Docs, Sheets, Slides, Tasks, Generative Language APIs
3. Configure OAuth Consent Screen → get Client ID + Secret
4. Get a Gemini API key

### Local Development

```bash
# Backend
cd backend && npm install
cp .env.example .env  # Fill in your credentials
node index.js

# Frontend (new terminal)
cd frontend && npm install --legacy-peer-deps
npm run dev
```

### Deploy to Cloud Run

```bash
cd ClearPath
gcloud run deploy clearpath-service --source . --region us-central1 --allow-unauthenticated
```

## 🔐 Security

- OAuth 2.0 with scoped permissions
- No hardcoded secrets (`.env.example` only)
- JWT in httpOnly cookies (not localStorage)
- Gemini calls backend-only (never from frontend)
- Input sanitization on all endpoints
- Rate limiting on all API routes
- Gentle Nudge + Ippo data is private — managers never see it

## 🎯 Demo Script

1. Google login → scoped permissions visible
2. Pre-Meeting Genie → brief generated from Google Doc
3. Post-Meeting → paste notes, watch Sheets populate
4. Smart Help → natural language → calendar invite
5. Gentle Nudge → detect stuck task → private check-in
6. Ippo → overwhelming task → 4 momentum steps
7. Daily Offload → calendar populated from priorities

## 📜 License

MIT
