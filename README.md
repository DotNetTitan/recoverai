# RecoverAI

<img src="/logo.png" width="300" alt="RecoverAI Logo" />

**RecoverAI** is a multi-modal, AI-powered platform designed to provide immediate, zero-typing support for individuals navigating substance use disorders (SUD) and their caregivers.

Developed during an AI hackathon, this platform bridges the gap between traditional treatment and the moments when individuals are most vulnerable, offering a voice-first crisis intervention tool and personalized grounding exercises.

## Features

- **Welcome Screen**: Warm onboarding start with golden Sparkles splash before collecting any personal info.
- **Zero-Typing Crisis Mode**: Tap-card or voice input only — no keyboard ever in crisis mode. AI generates personalized, name-aware responses spoken aloud via TTS. 112 (emergency) and 14416 / Tele-MANAS (mental health helpline) buttons always pinned at the bottom.
- **Personalized Emergency Scripts**: Choose a script type (Call Sponsor, Talk to Family, Self-Talk, Refuse Pressure), add a context tag, and AI drafts a first-person script. Tap any paragraph to hear it read aloud.
- **Safety Tools**: Box breathing animation with 4-4-4-4 timer, 5-4-3-2-1 sensory grounding exercise, trigger log with tap-card entry, and a safety plan builder.
- **Education Hub**: Curated articles across recovery topics plus an AI Q&A system with search. Every answer includes a "Read aloud" button.
- **Caregiver Hub**: "What do I say right now?" AI conversation guidance, crisis checklist, caregiver-specific articles, and app sharing.
- **Onboarding Flow**: 5-step setup — welcome, name, role (recovery/caregiver), substances + triggers, emergency contact.
- **AI Response Caching**: Repeated identical prompts skip the API call (in-memory cache, max 50 entries).
- **Error Boundaries**: Every AI-powered page is wrapped in an ErrorBoundary with a fallback showing emergency helpline numbers.
- **Privacy-First**: No backend database. All personal data (profile, trigger log, safety plan) is stored locally on-device using `localStorage`.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Modules with custom design system (no Tailwind)
- **Icons**: Lucide React
- **AI Integration**: Google Gemini 2.0 Flash via server-side Route Handler (API key never reaches the browser)
- **Testing**: Jest + React Testing Library (47 tests across 7 suites)
- **Linting**: ESLint with Next.js core-web-vitals + TypeScript configs

## Project Structure

```
recoverai/
├── app/                  # Route pages (App Router)
│   ├── crisis/           #   page + components.tsx + CSS module
│   ├── scripts/
│   ├── education/
│   ├── caregiver/
│   ├── settings/
│   ├── safety/
│   └── onboarding/
├── components/           # Shared components
│   ├── AiStatus.tsx      #   Skeleton loading + error banner
│   └── ErrorBoundary.tsx #   Catch-all error fallback
├── hooks/                # Custom React hooks
│   ├── useGemini.ts      #   AI call with cache
│   ├── useProfile.ts     #   Profile read/write
│   └── useSpeech.ts      #   TTS + voice recognition
├── context/              # React context + types
│   ├── AppContext.tsx    #   Global state with localStorage sync
│   └── types.ts          #   UserProfile, TriggerEntry, SafetyPlan
├── utils/
│   ├── constants.ts      #   Configuration constants
│   ├── prompts.ts        #   AI system prompts & builders
│   ├── helpers.ts        #   Utility functions
│   └── storage.ts        #   localStorage abstraction
└── __tests__/            # 47 tests, 7 suites
```

## Responsive Design

The app is built mobile-first with responsive improvements across all breakpoints:
- **≤360px**: Single-column nav grid, condensed card padding
- **361-480px**: Two-column nav grid, standard mobile layout
- **481-768px**: Wider gutters (32px), larger content area
- **≥769px**: Desktop-centered layout with 720px max-width
- **Landscape orientation**: Optimized card sizing and grid layouts
- **dvh fallback**: Graceful degradation for browsers without dynamic viewport unit support
- **Fluid typography**: All font sizes use `clamp()` for smooth scaling
- **Reduced motion**: All animations respect `prefers-reduced-motion`

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

The project has **47 tests across 7 test suites**:

| Suite | Tests | Area |
|---|---|---|
| `constants.test.ts` | 3 | Prompt builders, hotline constants |
| `storage.test.ts` | 8 | localStorage profile, triggers, safety plan |
| `useGemini.test.ts` | 5 | AI hook success/error/caching/loading states |
| `crisis.test.tsx` | 10 | Crisis mode UI, tap cards, 112 + 14416, fallback, no-keyboard |
| `scripts.test.tsx` | 6 | Script selection, AI generation, read-aloud controls |
| `education.test.tsx` | 6 | Q&A search, categories, AI answer display, read-aloud |
| `caregiver.test.tsx` | 6 | Hub cards, guidance view, AI call, read-aloud |

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
- Every back button has a descriptive `aria-label` ("Go back to home")
- Screen reader support via `aria-live` regions, `aria-busy`, and `aria-label` attributes
- Color contrast meets WCAG AA standard (4.5:1 minimum)
- Animations respect `prefers-reduced-motion`
- Every content card has a "Read aloud" button
- Icon-only buttons include `aria-label` (e.g. search, voice input)

## Disclaimer

RecoverAI is a supportive tool built for hackathon demonstration purposes. It is **not** a medical service. In an emergency, please dial **112** (India's unified emergency number). For mental health crisis support, call **14416** (Tele-MANAS, Government of India national helpline) or Kerala's **1056** (DISHA).
