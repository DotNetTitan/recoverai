# IDE Handoff — RecoverAI App (PromptWars Hackathon)

## Situation
I am mid-way through a hackathon. My previous IDE session ran out of tokens. I have ~3 hours left.
**Do NOT start from scratch. Read the existing codebase first, understand what's there, then make targeted improvements only.**

---

## The Challenge (What We're Building)

**Challenge:** Recovery and Prevention Platform
**Event:** Google for Developers × H2S PromptWars (In-person)

Build a multi-modal, GenAI-powered recovery and prevention platform that:
- Supports individuals navigating **substance use disorders (SUD)** and their caregivers
- Uses a **GenAI API** as the core engine for all AI features
- Provides **zero-typing interventions** — voice input + tap cards, no keyboard ever in crisis mode
- Generates **personalized emergency scripts** based on user profile
- Includes **educational resources** and **contextual safety tools**
- Empowers users and families when **cognitive load is highest**

---

## Current Evaluation Scores (Warm-Up Submission)

| Parameter | Score | Weight | Status |
|---|---|---|---|
| Testing | 48/100 | Low | 🔴 CRITICAL — fix this first |
| Efficiency | 80/100 | Medium | 🟡 Needs improvement |
| Code Quality | 86/100 | **High** | 🟡 Needs improvement |
| Problem Statement Alignment | 94/100 | **High** | 🟢 Polish only |
| Accessibility | 96/100 | Low | ✅ Leave it |
| Security | 98/100 | Medium | ✅ Leave it |
| **Overall** | **87.53/100** | | Top 5 of 100 teams |

**Goal: Push to 93+/100 overall. Work in this order: Testing → Code Quality → Efficiency → PSA.**

---

## Evaluation Criteria Explained

- **High Impact** = Code Quality + Problem Statement Alignment → carry the most leaderboard weight
- **Medium Impact** = Security + Efficiency → still matter significantly
- **Low Impact** = Testing + Accessibility → tiebreakers; cannot be ignored

Final score = sum of all 6 parameters. No category is skipped.

---

## Key App Flows (What the App Does)

### 1. Crisis Mode (Core Feature — Zero Typing)
1. User taps "I Need Help Now" on home screen
2. Full-screen crisis UI — NO navigation bar, NO menus visible
3. User chooses: voice input via microphone OR one of 5 large tap cards:
   - "I'm having a craving"
   - "I'm about to use"
   - "I feel overwhelmed"
   - "I need to call someone"
   - "I need a grounding exercise"
4. Input goes to the AI → personalized response shown as text and spoken aloud
5. "Call 988" and "Call [emergency contact]" always pinned at bottom of screen

### 2. Emergency Scripts
- User picks script type (Call Sponsor / Talk to Family / Self-Talk / Refuse Pressure)
- Optional: tap a context tag to add situational context
- AI generates a short personalized script
- Displayed in large text, tappable to hear each sentence read aloud

### 3. Safety Tools
- Grounding exercises: box breathing timer, 5-4-3-2-1 sensory guide — all audio-guided, no reading required
- Trigger tracker: log moments via tap cards + voice
- Safety plan builder: AI asks one question at a time, builds the user's personal plan

### 4. Education Hub
- Curated articles + AI Q&A
- Every article has a "Read Aloud" button

### 5. Caregiver Mode
- Role-based view set during onboarding
- "What do I say right now?" feature → AI guidance
- Crisis checklist and caregiver-specific articles

---

## Security Rules (Already 98 — Do NOT Break These)
- AI API key must never appear in source code — only in environment config
- All AI responses must be rendered as plain text, never injected as raw HTML
- Every AI call must have error handling with a safe fallback message
- AI system prompts must instruct the model never to provide harmful information and to always recommend 988 for emergencies
- No debug logging statements in the codebase

---

## Accessibility Rules (Already 96 — Do NOT Break These)
- All tap targets minimum 48×48px
- Every interactive element must have a descriptive accessible label
- Color contrast must meet WCAG AA standard (4.5:1 minimum)
- Animations must respect reduced-motion user preference
- Every content card must have a "Read Aloud" option

---

## What You Need To Do (Priority Order)

### TASK 1 — Testing (Score: 48 → target 85+) 🔴 MOST URGENT

Read the existing codebase to understand what's there, then write tests that cover the actual code. Focus on:

**AI client / API wrapper:**
- Successful AI response is parsed and returned correctly
- Network error returns a safe fallback message, not a crash
- Empty or malformed AI response returns the fallback message

**User profile (storage):**
- Saving a profile persists it correctly
- Loading a profile returns the saved data
- Loading when nothing is saved returns safe default values
- Updating a profile merges fields without wiping existing ones

**Crisis Mode:**
- The emergency help button is present on the home screen
- All tap-card options are visible in crisis mode
- The 988 emergency number is always visible in crisis mode
- Selecting a tap card triggers an AI call
- If the AI call fails, a fallback message is shown — never a blank screen
- No text keyboard input field exists anywhere in the crisis flow

**Emergency Scripts:**
- All script type options are rendered
- Selecting a type triggers an AI call
- The generated script is displayed in readable large text
- A "read aloud" control is present on the generated script

Aim for **15–20 meaningful test cases** across these areas.

---

### TASK 2 — Code Quality (Score: 86 → target 95+) 🟡 HIGH WEIGHT

Read every source file first, then improve:

1. **Split large components** — any component file over 150 lines should be broken into smaller focused sub-components
2. **Add documentation comments** to all custom hooks and utility functions explaining what they do, their parameters, and return values
3. **Centralize hardcoded strings** — all prompt templates, UI labels, error messages, and category names should be in one constants/config file, not scattered inline
4. **Add type annotations or prop validation** to all components
5. **Add error boundaries** around the Crisis Mode and Scripts sections so one failure doesn't crash the whole app
6. **Fix all linter warnings** — run the linter and resolve every warning
7. **Remove all debug log statements** from the codebase
8. **Consistent conventions** — event handlers named consistently, async operations use consistent patterns throughout

---

### TASK 3 — Efficiency (Score: 80 → target 90+) 🟡 MEDIUM WEIGHT

1. **Lazy load non-critical pages** — only the home screen and crisis mode should load immediately; all other pages should load on demand
2. **Cache AI responses** — if the same prompt has been asked this session, return the cached response instead of making another API call
3. **Replace spinners with skeleton loaders** — show placeholder shapes while content loads, not spinning indicators
4. **Memoize stable components** — components that receive the same props shouldn't re-render unnecessarily
5. **Run a performance audit** (browser DevTools → Lighthouse → Performance) and fix the top issues it flags

---

### TASK 4 — Problem Statement Alignment Polish (Score: 94 → target 98+) 🟢 HIGH WEIGHT

1. **Verify zero-typing is truly zero** — walk through the entire crisis flow manually; if the keyboard appears at any point, fix it
2. **Personalization must be visible in responses** — the user's name and at least one of their known triggers must appear in AI-generated responses, proving it's personalized not generic
3. **Crisis UI must be stripped down** — when in crisis mode, hide navigation and menus; show only the AI response, input method, and emergency call buttons
4. **Caregiver module** — confirm at least 2 distinct caregiver-only features exist and are reachable

---

## Important Constraints
- Do NOT rewrite the app from scratch — read what exists and improve it
- Do NOT modify anything related to Security or Accessibility — those scores are near-perfect
- The 988 emergency number must always be visible on any crisis-related screen
- AI responses must always be rendered as plain text — never as raw HTML
- The AI API key must never appear in source code

---

*Handoff generated mid-hackathon | RecoverAI | PromptWars*
