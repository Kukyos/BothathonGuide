<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ef69bc7e-3132-4766-b55f-d80365f1af2e

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create `.env` with:
   - `GROQ_API_KEY=your_key_here` (recommended)
   - `VITE_GROQ_API_KEY=your_key_here` (optional local fallback only)
3. Run the app:
   `npm run dev`

## Deploy To Vercel

1. Import the repo into Vercel.
2. In Project Settings -> Environment Variables, add:
   - `GROQ_API_KEY` = your Groq API key
3. Deploy.

Notes:
- The app calls `/api/groq` on Vercel, and that serverless function reads `GROQ_API_KEY` securely.
- `VITE_GROQ_API_KEY` is only for local fallback and is exposed to the browser bundle.
