# PRD: RecoverAI — Multi-Modal GenAI Recovery & Prevention Platform

> **Event:** Google for Developers × H2S PromptWars (In-person)  
> **Challenge:** Recovery and Prevention Platform  
> **Evaluation:** Code Quality (High), Problem Statement Alignment (High), Security (Medium), Efficiency (Medium), Testing (Low), Accessibility (Low)

---

## 1. Product Overview

**RecoverAI** is a multi-modal, GenAI-powered web application that supports individuals navigating substance use disorders (SUD) and their caregivers. The platform delivers help precisely when cognitive load is at its peak — during cravings, relapses, or crisis moments — through zero-typing interactions, AI-generated personalized scripts, educational resources, and contextual safety tools.

### 1.1 Core Design Philosophy
- **Zero-Friction First**: The user must never be required to type during high-stress moments. All crisis interactions are driven by voice, large tap targets, or pre-configured options.
- **Personalization by AI**: Gemini API powers all interventions, scripts, and content — making responses context-aware and emotionally appropriate.
- **Multi-Modal**: The app supports voice input/output, visual cards, and text — switching seamlessly based on user state.

---

## 2. Target Users

| Persona | Description | Primary Need |
|---|---|---|
| **Person in Recovery** | Individual managing SUD, may be in early or sustained recovery | Crisis intervention, coping tools, emergency scripts |
| **At-Risk Individual** | Someone exposed to high-risk situations or high stress | Prevention tools, triggers awareness, grounding exercises |
| **Caregiver / Family** | Spouse, parent, or close friend supporting someone with SUD | Guidance scripts, alert system, educational resources |

---

## 3. Problem Statement Alignment (HIGH IMPACT)

The solution directly addresses every requirement in the challenge brief:

| Challenge Requirement | How RecoverAI Addresses It |
|---|---|
| Multi-modal GenAI-powered platform | Voice + visual + text UI; Gemini API is the core AI engine for all features |
| Supports individuals with SUD and caregivers | Dual-mode: user-facing crisis tools + caregiver-facing guidance module |
| Zero-typing interventions | Crisis mode uses voice input, one-tap buttons, swipe cards — no keyboard ever |
| Personalized emergency scripts | AI generates scripts in real time based on user profile, current trigger, and emotional state |
| Educational resources | AI-curated, multi-modal content library with voice narration |
| Contextual safety tools | Trigger tracker, safety plan builder, coping cards — all context-aware |
| Empower when cognitive load is highest | Simplified UI, large targets, calm visual design, voice-first in crisis mode |

---

## 4. Feature Specification

### 4.1 Onboarding & User Profile
**Purpose:** Collect minimal context to personalize all AI interactions.

**Requirements:**
- Simple onboarding flow (3–4 screens maximum)
- Collect: First name, role (person in recovery / caregiver), primary substance(s) of concern, known triggers (multi-select), emergency contact name + phone
- Store profile in `localStorage` or a lightweight backend (no auth required for hackathon scope)
- All collected data used to seed Gemini API system prompts for personalization

**Implementation Notes:**
- Use a step-by-step card UI (no long forms)
- Each step has a voice-over option reading the question aloud (Web Speech API)
- Profile can be updated any time from settings

---

### 4.2 Crisis Mode — Zero-Typing Intervention (CORE FEATURE)

**Purpose:** Provide immediate, AI-powered help during a craving or crisis with absolutely no typing required.

**Trigger:** Prominent "I Need Help Now" button on the home screen — large, always visible, red/high-contrast.

**Flow:**
1. User taps "I Need Help Now"
2. App transitions to a full-screen, calming Crisis Mode UI
3. A single spoken/displayed prompt appears: *"What's happening right now?"*
4. User responds via **voice** (Web Speech API for speech-to-text) OR taps one of 4–5 large pre-set cards:
   - "I'm having a craving"
   - "I'm about to use"
   - "I feel overwhelmed"
   - "I need to call someone"
   - "I need a grounding exercise"
5. Input (voice transcript or selected card) is sent to Gemini API with user profile context
6. Gemini responds with a **personalized intervention** delivered as:
   - A calm, spoken AI voice response (Text-to-Speech via Web Speech API)
   - A readable card with the key message
   - An immediate action recommendation (breathing exercise, script to read, who to call)

**Gemini Prompt Template (Crisis Mode):**
```
System: You are a compassionate crisis support companion for someone managing substance use disorder. 
The user's name is {name}. Their known triggers are: {triggers}. 
Their emergency contact is {contact_name}.
Keep responses calm, brief (under 100 words), non-judgmental, and immediately actionable.
Never diagnose or prescribe. Always suggest professional help for medical emergencies.

User: {voice_transcript_or_selected_option}
```

**Requirements:**
- Response must begin playing as audio within 2 seconds of submission
- UI must have a prominent "Call {emergency_contact}" button throughout Crisis Mode
- A "Call 988" (Suicide & Crisis Lifeline, covers SUD) button always visible
- Escape back to home with single tap
- No text input fields in this entire mode

---

### 4.3 Personalized Emergency Scripts

**Purpose:** AI-generated scripts the user can read aloud or follow step-by-step when they need to communicate with a caregiver, sponsor, or themselves.

**Script Types:**
- **Call Your Sponsor** — A guided script for what to say when calling their support person
- **Talk to Family** — A script for disclosing a relapse or requesting support from a loved one
- **Self-Talk Grounding** — A personal mantra/affirmation script generated for the user
- **Refuse Peer Pressure** — Words to say when declining substances in a social setting

**UX Flow:**
1. User selects script type from large icon cards
2. Optional: User taps a context tag (e.g., "after argument", "at a party", "alone at night")
3. Gemini generates a personalized, 150–200 word script
4. Script displayed in large readable text, broken into short sentences
5. User can tap any sentence to hear it read aloud
6. "Regenerate" button to get a new version

**Gemini Prompt Template (Scripts):**
```
System: Generate a personalized, warm, and practical script for someone in recovery from {substance} use disorder.
Their name is {name}. Context: {script_type}, Situation: {context_tag}.
Format: Short paragraphs, simple language, first-person voice. Max 200 words.
```

**Requirements:**
- Scripts cached in session to avoid re-generating on accidental navigation
- Font size minimum 18px; user can increase to 24px
- Share button to copy script to clipboard

---

### 4.4 Educational Resources Hub

**Purpose:** Multi-modal, AI-curated educational content for both users and caregivers.

**Content Categories:**
- Understanding Addiction (what is SUD, brain science, myths)
- Recovery Stages & What to Expect
- How to Support a Loved One (caregiver-specific)
- Medications & Treatment Options (general awareness only, not medical advice)
- Local Resources & Hotlines

**Implementation:**
- Static curated content cards (pre-written, reviewed) + AI-powered "Ask a Question" feature
- "Ask a Question" sends user query to Gemini with a safety-first system prompt
- Each article has a **"Read Aloud"** button (zero-typing accessibility)
- Caregiver mode shows caregiver-specific articles by default

**Gemini Prompt Template (Education Q&A):**
```
System: You are an educational assistant providing factual, compassionate information about substance use disorders and recovery.
Always recommend professional help for medical decisions.
Never provide dosage information or medical advice.
Keep answers under 150 words. Cite general health guidance, not specific treatments.

User: {user_question}
```

---

### 4.5 Contextual Safety Tools

**Purpose:** Help users understand and manage their triggers and build a personal safety plan.

#### 4.5.1 Trigger Tracker
- User logs a "moment" — what happened, how they felt, what they did
- Input: Voice or tap-to-select cards (mood, situation, outcome)
- Gemini analyzes patterns across logged moments and provides a weekly insight: *"You seem most at risk on weekend evenings. Here's what helped last time..."*
- Data stored locally (localStorage with JSON structure)

#### 4.5.2 Safety Plan Builder
- Guided AI conversation to help user build their personal safety plan
- Covers: Warning signs, internal coping strategies, social contacts, professional contacts, environment safety
- Gemini asks one question at a time, builds the plan iteratively
- Final plan saved as a readable, printable card

#### 4.5.3 Grounding Exercises (Zero-Typing)
- 5-4-3-2-1 sensory grounding exercise with voiced guidance
- Box breathing timer with animated visual + audio cues
- Body scan meditation (audio, no reading required)
- All exercises auto-play; user only needs to tap "Start"

---

### 4.6 Caregiver Module

**Purpose:** Equip caregivers with tools to support their loved one effectively.

**Features:**
- Caregiver-specific onboarding (their loved one's name, substance, current stage)
- "What do I say right now?" — AI-generated communication guidance based on situation
- Educational articles on enabling, boundaries, and self-care
- Crisis checklist: step-by-step what to do if a loved one is in crisis
- Link-sharing: Caregiver can share app link with the person in recovery (no deep account linking needed for hackathon)

---

## 5. Technical Architecture

### 5.1 Tech Stack (Recommended)
| Layer | Technology | Reason |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + CSS Modules | File-based routing, SSR/SSG, built-in API Routes, great Vercel DX |
| AI Engine | Google Gemini 2.0 Flash API | Required for Google for Developers event; fast, cost-efficient |
| Voice Input | Web Speech API (SpeechRecognition) | Native browser, no extra SDK |
| Voice Output | Web Speech API (SpeechSynthesis) | Native browser, no extra SDK |
| Icons | Lucide (lucide-react) | Lightweight, tree-shakeable, consistent icon set |
| State | React Context + localStorage (fully typed) | No backend needed, persists across sessions |
| Routing | Next.js App Router (file-based) | Built-in — no extra routing library needed |
| API Layer | Next.js Route Handlers (`/app/api/`) | Keeps Gemini API key server-side; never exposed to browser |
| Hosting | Vercel | Zero-config Next.js deploy, edge-ready |

### 5.2 Project Structure
```
/app                          # Next.js App Router root
  layout.tsx                  # Root layout (fonts, global providers)
  page.tsx                    # Home screen
  /onboarding/page.tsx
  /crisis/page.tsx
  /scripts/page.tsx
  /education/page.tsx
  /safety/page.tsx
  /caregiver/page.tsx
  /settings/page.tsx
  /api
    /gemini/route.ts          # Route Handler — Gemini API call (server-side, key never exposed)

/components
  /crisis                     # Crisis Mode components (.tsx)
  /scripts                    # Emergency script viewer (.tsx)
  /education                  # Resource hub (.tsx)
  /safety                     # Trigger tracker, safety plan, grounding (.tsx)
  /caregiver                  # Caregiver module (.tsx)
  /shared                     # Button, Card, VoicePlayer, etc. (.tsx)

/hooks
  useGemini.ts                # Calls /api/gemini Route Handler
  useSpeech.ts                # SpeechRecognition + SpeechSynthesis hook
  useProfile.ts               # User profile read/write hook

/context
  AppContext.tsx               # Global state (profile, mode, session) — fully typed
  types.ts                    # Shared TypeScript interfaces & types

/utils
  storage.ts                  # localStorage abstraction (typed)
  constants.ts                # Prompt templates, categories
```

> **`'use client'` rule:** Next.js App Router defaults to **Server Components**. Any file that uses `useState`, `useEffect`, `useContext`, `localStorage`, or any **Web Speech API** (`SpeechRecognition` / `SpeechSynthesis`) **must** have `'use client'` as its very first line. This applies to virtually every component in `/components/**` and every page that has interactivity. Pages that are purely static (e.g., a server-rendered education article list) can stay as Server Components.

### 5.3 Gemini API Integration

The Gemini API key lives **server-side only** inside a Next.js Route Handler. Client components call `/api/gemini` — the key is never sent to the browser.

```typescript
// app/api/gemini/route.ts  (Next.js Route Handler — server-side)
import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(req: NextRequest) {
  const { systemPrompt, userMessage, maxTokens = 300 } = await req.json();

  const res = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }] }
      ],
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 }
    })
  });

  const data = await res.json();
  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    "I'm here for you. Please call 988 if you need immediate help.";
  return NextResponse.json({ text });
}
```

```typescript
// hooks/useGemini.ts  (Client-side hook — calls the Route Handler)
interface GeminiParams {
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
}

export async function callGemini(params: GeminiParams): Promise<string> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  const data = await res.json();
  return data.text;
}
```

**Error Handling:** All Gemini calls must have a fallback response — the app must never crash or show an empty screen during a crisis flow.

### 5.4 Core TypeScript Interfaces (`context/types.ts`)

Define these on day one — all `localStorage` reads/writes and Gemini prompt interpolations depend on them.

```typescript
// context/types.ts

export type UserRole = 'recovery' | 'caregiver';

export type ScriptType =
  | 'call-sponsor'
  | 'talk-to-family'
  | 'self-talk'
  | 'refuse-pressure';

export type CrisisOption =
  | 'craving'
  | 'about-to-use'
  | 'overwhelmed'
  | 'need-to-call'
  | 'need-grounding';

export interface UserProfile {
  name: string;
  role: UserRole;
  substances: string[];          // e.g. ['alcohol', 'opioids']
  triggers: string[];            // e.g. ['stress', 'social events']
  emergencyContactName: string;
  emergencyContactPhone: string; // E.164 format: +1234567890
  onboardingComplete: boolean;
}

export interface TriggerEntry {
  id: string;                    // crypto.randomUUID()
  timestamp: number;             // Date.now()
  mood: string;                  // e.g. 'anxious', 'lonely'
  situation: string;             // e.g. 'at a party'
  outcome: string;               // e.g. 'called sponsor', 'used'
  notes?: string;
}

export interface SafetyPlan {
  warningSigns: string[];
  internalCopingStrategies: string[];
  socialContacts: string[];
  professionalContacts: string[];
  environmentSafetySteps: string[];
  createdAt: number;
  updatedAt: number;
}

export interface AppState {
  profile: UserProfile | null;
  triggerLog: TriggerEntry[];
  safetyPlan: SafetyPlan | null;
}

// localStorage keys
export const STORAGE_KEYS = {
  PROFILE: 'recoverai_profile',
  TRIGGER_LOG: 'recoverai_trigger_log',
  SAFETY_PLAN: 'recoverai_safety_plan',
} as const;
```

---

## 6. Security Requirements (MEDIUM IMPACT)

| Requirement | Implementation |
|---|---|
| API key never exposed | Gemini API key in `.env.local` via `GEMINI_API_KEY` (no `NEXT_PUBLIC_` prefix); consumed only inside the Next.js Route Handler — never bundled into client JS |
| No PII sent to AI | User profile data (name, triggers) is interpolated locally into prompts, not stored on any external server |
| No sensitive data in console | Disable `console.log` in production build |
| XSS prevention | Never use `dangerouslySetInnerHTML`; sanitize all AI responses before render; TypeScript types prevent unintentional raw HTML injection |
| Safe fallbacks | All AI calls wrapped in try/catch; crisis flows always show 988 number if AI fails |
| HTTPS only | Deploy to HTTPS-only host (Vercel default) |
| Content Safety | Gemini API system prompts include explicit instructions not to provide dangerous information |

---

## 7. Efficiency Requirements (MEDIUM IMPACT)

| Requirement | Implementation |
|---|---|
| Fast Time-to-Interactive | Next.js automatic per-page code splitting; `dynamic()` for heavy components (Education, Caregiver) |
| Minimal API calls | Cache AI responses in `sessionStorage` per context key; don't re-call for same input |
| Optimistic UI | Show loading skeleton immediately; stream Gemini response if API supports it |
| Bundle size | No heavy dependencies; avoid moment.js, lodash, etc. |
| Voice processing | Use browser-native Web Speech API — no external audio SDK |
| Crisis mode speed | Pre-warm Gemini connection on home screen load so crisis response is instant |

---

## 8. Testing Requirements (LOW IMPACT)

Write tests that cover the most critical paths:

```
/tests
  geminiClient.test.ts     # Unit test: API wrapper, error handling, fallback
  useProfile.test.ts       # Unit test: localStorage read/write, defaults
  CrisisMode.test.tsx      # Integration: voice input → AI response → TTS output flow
  SafetyPlan.test.tsx      # Integration: multi-step builder saves correctly
```

**Testing Framework:** Jest + React Testing Library (TypeScript) — configured via `next/jest` preset  
**Key test cases:**
1. Gemini API failure → fallback message shown, 988 number displayed
2. Voice recognition unavailable (browser unsupported) → tap-card fallback shown
3. Profile with no triggers → AI still returns valid script (graceful empty state)
4. Crisis mode: user taps "Call 988" → tel: link fires

---

## 9. Accessibility Requirements (LOW IMPACT)

| Requirement | Implementation |
|---|---|
| Touch targets ≥ 48×48px | All buttons and cards meet this minimum (CSS: `min-height: 48px; min-width: 48px`) |
| Color contrast ≥ 4.5:1 | Use white/light text on dark backgrounds; test with browser DevTools |
| Screen reader support | All interactive elements have `aria-label`; images have `alt` text |
| Focus indicators | Visible `:focus-visible` outlines on all interactive elements |
| Reduced motion | Respect `prefers-reduced-motion` for animations (breathing timer) |
| Font size | Base 16px minimum; Crisis Mode uses 20px+; user can scale to 24px |
| Voice-first | Every content card has a "Read Aloud" option — no reading required |
| Keyboard navigation | Full tab-order through all flows; no mouse-only interactions |

---

## 10. UI/UX Design Direction

> **Canonical reference:** All visual decisions — colours, typography, spacing, component rules, and accessibility guidelines — are defined in [`design.md`](./design.md). This section provides an in-PRD summary only. **When the two documents conflict, `design.md` takes precedence.**

### 10.1 Visual Personality (from `design.md` §1)
- **Empathetic & Calm** — Soft edges, soothing greens, ample whitespace to reduce anxiety.
- **Reliable & Professional** — Sturdy typography and clear hierarchy to build trust.
- **Action-Oriented** — High-contrast interactive elements for crisis-mode usability.

### 10.2 Colour Tokens (from `design.md` §2)
| Token | Hex | Usage |
|---|---|---|
| Deep Emerald | `#1A2E2A` | Main background |
| Forest Green | `#2D4F48` | Secondary background / card surfaces |
| Mint Tint | `#E6F2F0` | Light text / elements on dark |
| Warm White | `#F5F0E8` | Primary text (dark mode) |
| Soft Stone | `#D1CDC7` | Secondary text, borders |
| Oatmeal | `#EBE7E0` | Surface colours |
| Crisis Red | `#E53E3E` | Urgent actions — "I Need Help Now" |
| Calm Blue | `#4299E1` | Educational content, information |
| Supportive Gold | `#ECC94B` | Affirmations, grounding exercises |

### 10.3 Typography (from `design.md` §3)
- **Font:** Inter (or system sans-serif)
- **Scale:** Display 32px (Crisis headers) → H1 24px → H2 20px → Body 18px (minimum) → Small 16px

### 10.4 Component Rules (from `design.md` §4)
- **Crisis Mode cards:** min 120px height, 24px border-radius, 48px touch targets
- **Interactive cards:** soft shadows, Soft Stone borders, 16px border-radius, integrated voice ("Listen") icon
- **Navigation:** Mobile-first bottom nav; persistent high-contrast FAB for crisis access

### 10.5 Key Screens

**Home Screen:**
- Large "I Need Help Now" CTA (Crisis Red `#E53E3E`, always above fold)
- User's name and a contextual affirmation (Supportive Gold `#ECC94B`)
- 4 icon cards using **Lucide icons**: `<FileText />` Scripts | `<BookOpen />` Learn | `<Shield />` Safety Tools | `<Heart />` Caregiver
- Today's quick grounding exercise card at bottom

**Crisis Mode Screen:**
- Full Deep Emerald background (`#1A2E2A`), single centered message
- 4–5 large situation cards (min 120px, 24px radius) with Lucide icons: `<AlertCircle />`, `<Wind />`, `<Phone />`, etc. OR `<Mic />` for voice
- "Call 988" (`<PhoneCall />`) and "Call {contact_name}" (`<Phone />`) always pinned at bottom

**Scripts Screen:**
- 4 script type cards with Lucide icons: `<Users />` Call Sponsor | `<Home />` Talk to Family | `<MessageCircle />` Self-Talk | `<ShieldOff />` Refuse Pressure
- Situation context chips (tap to select)
- Generated script in large, well-spaced text (Body scale minimum 18px)

---

## 11. Implementation Phases (Hackathon Timeline)

### Phase 1 — Core (First 2 hours)
- [ ] Project setup: `npx create-next-app@latest . --typescript --eslint --app --no-tailwind` + install `lucide-react`
- [ ] Define TypeScript types/interfaces in `context/types.ts`
- [ ] Create `/app/api/gemini/route.ts` Route Handler (server-side Gemini call)
- [ ] Onboarding flow (profile creation, localStorage)
- [ ] Home screen with Lucide icon navigation cards
- [ ] Crisis Mode: tap cards → Gemini call → text response

### Phase 2 — Multi-Modal (Next 1.5 hours)
- [ ] Add voice input (SpeechRecognition) to Crisis Mode
- [ ] Add Text-to-Speech output to Crisis Mode and Scripts
- [ ] Emergency Scripts: 4 types, Gemini-generated, read-aloud

### Phase 3 — Depth (Next 1 hour)
- [ ] Grounding exercises (box breathing timer, 5-4-3-2-1 guided)
- [ ] Education hub with AI Q&A
- [ ] Trigger tracker (basic log + AI insight)

### Phase 4 — Polish (Final 30 minutes)
- [ ] Caregiver mode (role-based view)
- [ ] 988 and emergency contact integrations
- [ ] Accessibility pass (aria labels, contrast, focus)
- [ ] Error states and AI fallback messaging

---

## 12. Environment Variables

```env
# .env.local  (never committed to source control)
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Why no `NEXT_PUBLIC_` prefix?** Variables without this prefix are server-only in Next.js. The key is accessed exclusively in `/app/api/gemini/route.ts` — it is **never bundled** into client-side JavaScript.

> **Note:** Never commit `.env.local` to source control. Next.js adds it to `.gitignore` automatically on project creation.

---

## 13. Crisis Safety Disclaimer (Required)

The app must display on first launch and in settings:

> *"RecoverAI is a supportive tool, not a medical service. In case of a medical emergency, call 911. For mental health or substance use crisis support, call or text 988 (Suicide & Crisis Lifeline, free, 24/7). This app does not replace professional medical advice, diagnosis, or treatment."*

---

## 14. Out of Scope (Hackathon)

- User authentication / backend database
- Push notifications
- Native mobile app (PWA optional stretch goal)
- Real-time caregiver alerts
- Integration with EHR or clinical systems
- Medication tracking

---

## 15. Assumptions (Please Confirm)

1. **Tech stack is flexible** — Next.js 14 (App Router) + TypeScript + Gemini API assumed; adjust if organizers require specific tools
2. **No backend required** — All data stored client-side (localStorage, fully typed). Adjust if a backend is available.
3. **Gemini API key** — You will need to obtain one from [Google AI Studio](https://aistudio.google.com/)
4. **Web app (not mobile)** — Browser-based app. Can add PWA manifest for mobile install.
5. **"988"** — US Suicide & Crisis Lifeline covers SUD. Adjust hotline if event is outside the US.

---

*PRD Version 1.4 | RecoverAI | PromptWars Hackathon*
