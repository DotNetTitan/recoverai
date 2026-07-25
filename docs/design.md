# Design System: RecoverAI

RecoverAI is a multi-modal recovery and prevention platform designed for high-stress crisis moments and daily support. The visual language emphasizes calm, accessibility, and high-contrast clarity to support users with high cognitive load.

## 1. Visual Personality
- **Empathetic & Calm**: Soft edges, soothing greens, and ample whitespace to reduce anxiety.
- **Reliable & Professional**: Sturdy typography and clear hierarchy to build trust.
- **Action-Oriented**: High-contrast interactive elements for crisis-mode usability.

## 2. Color Palette

### Primary (Nature & Growth)
- **Deep Emerald**: `#1A2E2A` (Main background, grounding)
- **Forest Green**: `#2D4F48` (Secondary background)
- **Mint Tint**: `#E6F2F0` (Light text/elements on dark)

### Neutral (Warmth & Comfort)
- **Warm White**: `#F5F0E8` (Main text color for dark mode)
- **Soft Stone**: `#D1CDC7` (Secondary text, borders)
- **Oatmeal**: `#EBE7E0` (Surface colors)

### Functional (Safety & Crisis)
- **Crisis Red**: `#E53E3E` (Urgent actions, "I Need Help Now")
- **Calm Blue**: `#4299E1` (Educational content, information)
- **Supportive Gold**: `#ECC94B` (Affirmations, grounding)

## 3. Typography
- **Primary Font**: Inter (or system sans-serif)
- **Scale**:
  - **Display**: 32px / 40px (Crisis Mode headers)
  - **Heading 1**: 24px / 32px (Section titles)
  - **Heading 2**: 20px / 28px (Card titles)
  - **Body**: 18px / 28px (Minimum for readability)
  - **Small**: 16px / 24px (Only for secondary metadata)

## 4. Components & Layout

### 4.1 Crisis Mode
- **Background**: Full-screen Deep Emerald.
- **Interaction**: Large cards (minimum 120px height) with 24px rounded corners.
- **Buttons**: Minimum 48px touch targets, bold labels.

### 4.2 Interactive Cards
- **Style**: Soft shadows, subtle borders (Soft Stone), 16px border-radius.
- **Voice Feedback**: Integrated "Listen" icon buttons on all text cards.

### 4.3 Navigation
- **Mobile-First**: Bottom-pinned navigation for primary recovery tools.
- **Crisis Access**: Persistent high-contrast "Help" floating action button (FAB).

## 5. Accessibility Guidelines
- **Contrast**: Maintain AA/AAA standard for all text.
- **Motion**: Respect `prefers-reduced-motion`; use gentle fades rather than jarring slides.
- **Input**: Voice-first alternatives for every text-based interaction.
