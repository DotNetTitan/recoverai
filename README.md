# RecoverAI 

<img src="./recoverai_primary_logo.png" width="300" alt="RecoverAI Logo" />

**RecoverAI** is a multi-modal, AI-powered platform designed to provide immediate, zero-typing support for individuals navigating substance use disorders (SUD) and their caregivers. 

Developed during an AI hackathon, this platform bridges the gap between traditional treatment and the moments when individuals are most vulnerable, offering a voice-first crisis intervention tool and personalized grounding exercises.

## 🚀 Features

- **Zero-Typing Crisis Mode**: Speak directly to the app during overwhelming moments and receive calm, AI-generated guidance.
- **Personalized Emergency Scripts**: AI drafts scripts to help users navigate tough social situations (e.g., refusing peer pressure, calling a sponsor).
- **Safety Tools**: Box breathing animations, 5-4-3-2-1 grounding exercises, and a persistent trigger log.
- **Caregiver Hub**: Dedicated resources to help loved ones understand the recovery process and establish healthy boundaries.
- **Privacy-First**: No backend database. All personal profile data (triggers, contacts, logs) is stored locally on the user's device using `localStorage`.

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Modules (Custom Design System, no Tailwind)
- **Icons**: Lucide React
- **AI Integration**: Google Gemini 2.0 Flash via server-side Route Handlers
- **Testing**: Jest & React Testing Library
- **CI/CD**: GitHub Actions

## 🚦 Getting Started

### Prerequisites
- Node.js (v20+)
- A Google Gemini API Key

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
   Create a `.env.local` file in the `recoverai` directory and add your key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🧪 Testing
The project uses Jest for testing. Tests are automatically run via the GitHub Actions CI pipeline.
```bash
cd recoverai
npm run test
```

## ⚠️ Disclaimer
RecoverAI is a supportive tool built for hackathon demonstration purposes. It is **not** a medical service. In an emergency, please call 911. For crisis support, call or text 988.