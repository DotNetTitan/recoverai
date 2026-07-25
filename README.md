# RecoverAI

<img src="./recoverai_primary_logo.png" width="300" alt="RecoverAI Logo" />

**RecoverAI** is a multi-modal, AI-powered platform designed to provide immediate, zero-typing support for individuals navigating substance use disorders (SUD) and their caregivers.

Developed during an AI hackathon, this platform bridges the gap between traditional treatment and the moments when individuals are most vulnerable, offering a voice-first crisis intervention tool and personalized grounding exercises.

## Features

- **Zero-Typing Crisis Mode**: Tap-card or voice input only — no keyboard ever in crisis mode. AI generates personalized, name-aware responses spoken aloud via TTS. 112 (emergency) and 14416 / Tele-MANAS (mental health helpline) buttons always pinned at the bottom.
- **Personalized Emergency Scripts**: Choose a script type (Call Sponsor, Talk to Family, Self-Talk, Refuse Pressure), add a context tag, and AI drafts a first-person script. Tap any paragraph to hear it read aloud.
- **Safety Tools**: Box breathing animation with 4-4-4-4 timer, 5-4-3-2-1 sensory grounding exercise, trigger log with tap-card entry, and a safety plan builder.
- **Education Hub**: Curated articles across recovery topics plus an AI Q&A system. Every answer includes a "Read aloud" button.
- **Caregiver Hub**: Crisis checklist, "What do I say right now?" AI conversation guidance, caregiver-specific articles, and app sharing.
- **Onboarding Flow**: 4-step setup capturing name, role (recovery/caregiver), substances, triggers, and emergency contact.
- **Privacy-First**: No backend database. All personal data (profile, trigger log, safety plan) is stored locally on-device using `localStorage`.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Modules with custom design system (no Tailwind)
- **Icons**: Lucide React
- **AI Integration**: Google Gemini 2.0 Flash via server-side Route Handler (API key never reaches the browser)
- **Testing**: Jest + React Testing Library (31 tests)
- **Linting**: ESLint with Next.js core-web-vitals + TypeScript configs

## Responsive Design

The app is built mobile-first with responsive improvements across all breakpoints:
- **≤360px**: Single-column nav grid, condensed card padding
- **361-480px**: Two-column nav grid, standard mobile layout
- **481-768px**: Wider gutters (32px), larger content area
- **≥769px**: Desktop-centered layout with 720px max-width
- **Landscape orientation**: Optimized card sizing and grid layouts
- **dvh fallback**: Graceful degradation for browsers without dynamic viewport unit support
- **Fluid typography**: All font sizes use `clamp()` for smooth scaling

## Getting Started

### Prerequisites
- Node.js (v20+)
- A Google Gemini API Key ([get one here](https://aistudio.google.com))

### Installation

1. Navigate to the app directory:
   ```bash
   cd recoverai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your API key:
   Create a `.env.local` file in the `recoverai` directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest test suite |

## Testing

The project has 31 tests across 5 test suites covering:

| Suite | Tests | Area |
|---|---|---|
| `constants.test.ts` | 3 | Prompt builders, hotline constant |
| `storage.test.ts` | 8 | localStorage profile, triggers, safety plan |
| `useGemini.test.ts` | 5 | AI hook success/error/caching/loading states |
| `crisis.test.tsx` | 10 | Crisis mode UI, tap cards, 112 + 14416, fallback, no-keyboard |
| `scripts.test.tsx` | 6 | Script selection, AI generation, read-aloud controls |

```bash
npm test
```

## API

The single API endpoint is a server-side Route Handler at `/api/gemini` that proxies requests to Google Gemini 2.0 Flash. The API key is never exposed to the browser — only referenced server-side via `process.env.GEMINI_API_KEY`.

## Security

- AI API key is server-only via environment variable
- All AI responses rendered as plain text, never raw HTML
- Every AI call has error handling with a safe fallback message ("Call 14416")
- System prompts instruct the model never to provide harmful information and to always recommend 14416 (Tele-MANAS) and 112 for emergencies
- No debug logging statements in production code

## Accessibility

- All tap targets minimum 48x48px
- Every interactive element has a descriptive `aria-label`
- Color contrast meets WCAG AA standard (4.5:1 minimum)
- Animations respect `prefers-reduced-motion`
- Every content card has a "Read Aloud" option
- Screen reader support via `aria-live` regions and `aria-busy` attributes

## Disclaimer

RecoverAI is a supportive tool built for hackathon demonstration purposes. It is **not** a medical service. In an emergency, please dial **112** (India's unified emergency number). For mental health crisis support, call **14416** (Tele-MANAS, Government of India national helpline) or Kerala's **1056** (DISHA).
