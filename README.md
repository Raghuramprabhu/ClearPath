# ClearPath

**You think. We coordinate.**

ClearPath is an AI-powered team collaboration platform that eliminates the cognitive overhead of coordination. It offloads scheduling, preparation, follow-up, and task routing by deeply integrating with the Google Ecosystem (Gemini, Calendar, Docs, Sheets).

## Features

- **Pre-Meeting Genie:** Automatically generates a personalized brief for each attendee before a meeting based on calendar agendas and current tasks.
- **Post-Meeting Intelligence:** Extracts decisions, action items, owners, and deadlines from raw meeting notes using Gemini, and auto-populates Google Sheets.
- **Smart Help Scheduler:** Uses natural language processing to find the best time for team members to meet, considering existing commitments and task urgency.
- **Daily Cognitive Offload:** Recommends an optimal daily schedule based on tasks and deadlines, prioritizing deep work in the morning.

## Architecture

ClearPath is a monorepo containing:
- **Frontend**: React 18 + Vite, styled with Tailwind CSS.
- **Backend**: Node.js + Express server.
- **AI Layer**: `@google/genai` using the `gemini-1.5-pro` model.
- **Integrations**: `googleapis` for Calendar, Docs, Sheets, Slides, and Tasks.

### Deployment Strategy

Both the frontend and backend are containerized into a single Docker image and deployed to **Google Cloud Run**. The frontend static assets are built and served by the Express backend, eliminating CORS issues and simplifying the deployment pipeline.

## Getting Started

### Prerequisites

1. Create a Google Cloud Platform (GCP) project.
2. Enable the following APIs: Calendar API, Docs API, Sheets API, Slides API, Tasks API, and Generative Language API (Gemini).
3. Configure the OAuth Consent Screen and obtain a `Client ID` and `Client Secret`.
4. (Optional) Set up a Firebase project for real-time state and notifications.

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ClearPath
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Fill out .env with your GCP and Gemini credentials
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   # Update the Google Client ID in src/App.jsx
   npm run dev
   ```

### Deployment to Google Cloud Run (No local Docker required)

You can deploy the app directly from source using the Google Cloud CLI. Cloud Build will automatically use the provided `Dockerfile` to build the container.

```bash
cd ClearPath
gcloud run deploy clearpath-service --source . --region us-central1 --allow-unauthenticated
```
