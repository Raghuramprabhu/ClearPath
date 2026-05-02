# ClearPath

### *You think. We coordinate.*

---

> *"The biggest breakthroughs come from understanding how intelligence actually works — not how we assume it should."*
> — Inspired by **Demis Hassabis**, Founder & CEO, Google DeepMind

---

## The Problem No One is Solving

Every team collaboration tool on the market was designed for how *managers think* teams should work — dashboards full of status updates, Kanban boards that track outputs, and notification systems that optimise for **visibility of failure**.

But none of them address the real bottleneck: **cognitive processing overhead**.

Drawing inspiration from Demis Hassabis's pioneering work at Google DeepMind — where the fundamental insight was that intelligence isn't about brute-force computation but about understanding the *architecture of cognition itself* — ClearPath applies the same first-principles thinking to team collaboration.

**The insight:** The biggest productivity killer in teams is not the lack of tools. It is the invisible tax of coordination — *who* to involve, *when* to meet, *what* to prepare, *what* was decided, *what* to do next, and *why* a task is stuck. This cognitive overhead compounds silently across every team member, every day, consuming the very mental bandwidth that should be spent on actual creative work.

**ClearPath eliminates that overhead entirely.**

By deeply integrating **12 Google services** with **Gemini 1.5 Pro AI**, ClearPath doesn't just help you collaborate — it gives you back the mental energy to do the work that actually matters.

---

## ✨ What Makes ClearPath Unique

### 1. 🔮 Pre-Meeting Genie
> *Never walk into a meeting cold again.*

30 minutes before any meeting, every attendee receives a **personalised AI-generated brief** — pulled from the actual Google Doc agenda, cross-referenced with their current tasks and role. Each brief includes 3 key talking points, prep questions, and estimated time saved.

### 2. 📋 Post-Meeting Intelligence
> *From chaos to clarity in seconds.*

Paste raw, messy meeting notes. Gemini extracts **decisions, action items, owners, and deadlines** — then auto-populates your Google Sheets task tracker and creates individual Google Tasks for each team member. What used to take 30 minutes of post-meeting admin now takes 10 seconds.

### 3. 📅 Smart Help Scheduler
> *"I need 30 mins with Priya about the API design."*

Type what you need in natural language. Gemini parses the intent — who, how long, what topic, how urgent. Google Calendar API finds the optimal slot considering both calendars, deadlines, and focus time. One click creates a Google Meet event with context pre-loaded.

### 4. ☀️ Daily Cognitive Offload
> *Your optimal day, designed by AI.*

Every morning, ClearPath reads your tasks from Google Sheets, checks your Google Calendar for commitments, and generates a recommended schedule — **deep work prioritised before noon, meetings in the afternoon**. One click pushes it to your calendar. Your brain no longer has to decide *what to work on* — it can just *work*.

### 5. 💛 Gentle Nudge — *Not a follow-up. A check-in.*
> *"No manager was pinged. No one felt watched. The work just moved forward."*

**The most psychologically safe task monitoring system ever built.**

When Gemini detects a stuck task (no update for configurable days, deadline approaching), it doesn't alert a manager. It **privately messages only the assignee** with a warm, empathetic check-in offering three options:

| Option | What Happens |
|--------|-------------|
| 🕐 *I need more time* | Task auto-rescheduled. Calendar updated. No one else knows. |
| 👥 *I need input from someone* | Smart Help Scheduler activates to book a session. |
| 🤝 *I need support* | Manager notified **with full context** — not a red flag, a support request. |

**The manager only ever sees an escalation if the person explicitly asks for help.** We didn't build a follow-up tool. We built psychological safety into the workflow.

### 6. 🧩 Ippo — Task Intelligence Layer
> *"Because task failure is a nervous system problem, not an organisation problem."*

An intelligent task companion that helps anyone break overwhelming tasks into **momentum-friendly steps**. First step is always completable in under 10 minutes. Progress is celebrated at every sub-task, not just at completion.

**Optional neurodivergent support mode** (completely private — team and managers never see this):
- Recovery protocol when task initiation fails: *Acknowledge → Breathe → Hydrate & Move → Brain dump → Grounding*
- Momentum starter — Gemini suggests the absolute smallest first action
- No-guilt language throughout — every prompt uses supportive framing
- Progress celebration at each micro-step

---

## 🔌 Google Ecosystem — 12 Services Deep

ClearPath is not a surface-level integration. It is built **natively on the Google ecosystem**, using 12 services as a unified intelligence layer:

| # | Service | How ClearPath Uses It |
|---|---------|----------------------|
| 1 | **Gemini 1.5 Pro** | 7 AI prompt functions — briefs, extraction, scheduling, nudges, task breakdown, recovery, daily planning |
| 2 | **Google Calendar API** | Fetch availability, create events with Meet links, push AI-recommended schedules, auto-reschedule tasks |
| 3 | **Google Docs API** | Read meeting agendas as AI context, auto-create post-meeting summary documents |
| 4 | **Google Sheets API** | Central task registry, auto-populate action items, feed task data to Gentle Nudge engine |
| 5 | **Google Slides API** | Fetch slide thumbnails linked in meeting agendas for visual context in briefs |
| 6 | **Google OAuth 2.0** | Single sign-on with scoped consent for Calendar, Docs, Sheets, Slides, Tasks |
| 7 | **Google Cloud Run** | Serverless backend hosting — all Gemini API calls routed securely through backend only |
| 8 | **Google Pub/Sub** | Calendar event triggers for automated pre-meeting brief generation |
| 9 | **Firebase Firestore** | Real-time team state — tasks, nudges, help requests synced across the team |
| 10 | **Firebase Cloud Messaging** | Push notifications for pre-meeting reminders, private nudge alerts, help requests |
| 11 | **Google Tasks API** | Sync action items to personal Google Tasks, bidirectional completion sync |
| 12 | **Google Meet** | Auto-generate Meet links for smart-scheduled help sessions |

---

## 🏗 Architecture

```
ClearPath/
├── frontend/                 # React 18 + Vite + Tailwind CSS
│   └── src/
│       ├── components/       # Sidebar navigation
│       ├── hooks/            # useAuth (Google OAuth context)
│       ├── pages/            # Dashboard + 6 features + Settings + Login
│       └── services/         # Centralised API client layer
├── backend/                  # Node.js + Express
│   ├── routes/               # auth, meetings, scheduler, nudge, ippo
│   ├── services/             # gemini (7 prompts), googleApis, pubsub
│   └── middleware/           # JWT auth, rate limiter, input sanitiser
├── Dockerfile                # Multi-stage build for Cloud Run
└── README.md
```

**Deployment:** Single Docker container → Google Cloud Run (frontend static assets served by Express backend)

---

## 🔐 Security by Design

- **OAuth 2.0** with minimum necessary scoped permissions
- **No hardcoded secrets** — `.env.example` with placeholders only
- **JWT in httpOnly cookies** — never localStorage
- **All Gemini calls backend-only** — frontend never touches the AI API
- **Input sanitisation** on every endpoint before Gemini processing
- **Rate limiting** on all API routes
- **Privacy-first**: Gentle Nudge and Ippo data are private — managers *cannot* see them

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/Raghuramprabhu/ClearPath.git
cd ClearPath

# Backend
cd backend && npm install
cp .env.example .env   # Add your GCP + Gemini credentials
node index.js

# Frontend (new terminal)
cd frontend && npm install --legacy-peer-deps
npm run dev
```

**Deploy to Cloud Run:**
```bash
gcloud run deploy clearpath-service --source . --region us-central1 --allow-unauthenticated
```

---

## 🎯 The Pitch

> How many of you spent time this week *coordinating* instead of actually *working*?
>
> Every tool on the market helps you collaborate. **ClearPath gives you back the mental energy to do the actual work.**
>
> We didn't build another collaboration tool. We built the thing that makes all your existing tools finally work together. And we built it for how humans *actually* work — not how spreadsheets think they should.
>
> Inspired by Demis Hassabis's insight that true intelligence comes from understanding cognition at its deepest level, ClearPath treats **cognitive overhead as the problem to solve** — not a symptom to manage.

---

**Built with ❤️ using Google Ecosystem + Gemini AI**

📎 [Live Demo](https://clearpath-service-998489824152.us-central1.run.app) · 📦 [Source Code](https://github.com/Raghuramprabhu/ClearPath.git)
