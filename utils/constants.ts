// utils/constants.ts — Shared app constants

export const CRISIS_OPTIONS = [
  { id: 'craving', label: "I'm having a craving" },
  { id: 'about-to-use', label: "I'm about to use" },
  { id: 'overwhelmed', label: 'I feel overwhelmed' },
  { id: 'need-to-call', label: 'I need to call someone' },
  { id: 'need-grounding', label: 'I need a grounding exercise' },
] as const;

export const SCRIPT_TYPES = [
  { id: 'call-sponsor', label: 'Call Your Sponsor', context: 'calling your support person/sponsor' },
  { id: 'talk-to-family', label: 'Talk to Family', context: 'disclosing a relapse or asking for support from a loved one' },
  { id: 'self-talk', label: 'Self-Talk Grounding', context: 'personal affirmation and grounding self-talk' },
  { id: 'refuse-pressure', label: 'Refuse Peer Pressure', context: 'declining substances in a social setting' },
] as const;

export const CONTEXT_TAGS = [
  'after an argument',
  'at a party',
  'alone at night',
  'at work',
  'feeling lonely',
  'stressed',
  'after a loss',
  'celebrating',
] as const;

export const SUBSTANCE_OPTIONS = [
  'Alcohol',
  'Opioids',
  'Cocaine / Crack',
  'Methamphetamine',
  'Cannabis',
  'Benzodiazepines',
  'Tobacco / Nicotine',
  'Other',
] as const;

export const TRIGGER_OPTIONS = [
  'Stress',
  'Social events',
  'Loneliness',
  'Arguments / conflict',
  'Boredom',
  'Anxiety',
  'Financial pressure',
  'Being around users',
  'Celebrations',
  'Physical pain',
] as const;

export const MOOD_OPTIONS = [
  'Anxious',
  'Lonely',
  'Angry',
  'Sad',
  'Stressed',
  'Bored',
  'Happy',
  'Overwhelmed',
] as const;

export const SITUATION_OPTIONS = [
  'At home alone',
  'At a social event',
  'At work',
  'With family',
  'Online / social media',
  'After an argument',
  'Public place',
] as const;

export const OUTCOME_OPTIONS = [
  'Called sponsor',
  'Used a coping skill',
  'Reached out to friend',
  'Relapsed',
  'Resisted',
  'Left the situation',
] as const;

export const APP_ROUTES = {
  HOME: '/',
  ONBOARDING: '/onboarding',
  SETTINGS: '/settings',
  CRISIS: '/crisis',
  SCRIPTS: '/scripts',
  EDUCATION: '/education',
  SAFETY: '/safety',
  CAREGIVER: '/caregiver',
} as const;

export const UI_TIMING = {
  COPY_FEEDBACK_MS: 2000,
} as const;

export const AI_CONFIG = {
  DEFAULT_MAX_TOKENS: 2048,
  CRISIS_MAX_TOKENS: 2048,
  EDUCATION_MAX_TOKENS: 3072,
  CAREGIVER_MAX_TOKENS: 2048,
  SCRIPT_MAX_TOKENS: 1536,
  CACHE_SIZE_LIMIT: 50,
  GEMINI_TEMPERATURE: 0.7,
  API_ROUTE: '/api/gemini',
  GEMINI_API_URL:
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
} as const;

export const AI_FALLBACK_MESSAGE =
  "I'm here for you. Please call 14416 (Tele-MANAS) if you need immediate help.";

export const AI_ERROR_MESSAGE = 'Could not connect. Please try again.';

export const AI_STATUS_MESSAGES = {
  LOADING: 'Creating supportive guidance...',
  ERROR: AI_ERROR_MESSAGE,
} as const;

export const HOME_NAV_CARDS = [
  { href: APP_ROUTES.SCRIPTS, icon: 'FileText', label: 'Emergency Scripts', desc: 'Guided scripts for tough moments' },
  { href: APP_ROUTES.EDUCATION, icon: 'BookOpen', label: 'Learn', desc: 'Understand recovery & addiction' },
  { href: APP_ROUTES.SAFETY, icon: 'Shield', label: 'Safety Tools', desc: 'Track triggers & build your plan' },
  { href: APP_ROUTES.CAREGIVER, icon: 'Heart', label: 'Caregiver', desc: 'Support for those who care' },
] as const;

export const AFFIRMATIONS = [
  'Every moment of resistance is a victory.',
  'You have survived 100% of your hardest days.',
  "Recovery is not a straight line - and that's okay.",
  'You are stronger than the urge.',
  'One moment at a time.',
] as const;

export const EDUCATION_ARTICLES: Record<string, string> = {
  'What is SUD?': 'https://nida.nih.gov/publications/drugfacts/understanding-drug-use-addiction',
  'Brain Science': 'https://nida.nih.gov/publications/drugs-brains-behavior-science-addiction/drugs-brain',
  'Common Myths': 'https://nida.nih.gov/research-topics/addiction-science/drugs-brain-behavior-science-of-addiction',
  'Early Recovery': 'https://nida.nih.gov/research-topics/recovery',
  'Maintenance': 'https://nida.nih.gov/publications/drugs-brains-behavior-science-addiction/treatment-recovery',
  'What to Expect': 'https://nida.nih.gov/research-topics/recovery',
  'Setting Boundaries': 'https://library.samhsa.gov/product/navigating-mental-health-substance-use-care/pep25-08-008',
  'Self-Care': 'https://library.samhsa.gov/sites/default/files/self-care-factsheet-pep25-08-009.pdf',
  'Avoiding Enabling': 'https://library.samhsa.gov/product/navigating-mental-health-substance-use-care/pep25-08-008',
  'Types of Treatment': 'https://nida.nih.gov/research-topics/treatment',
  'MAT Overview': 'https://nida.nih.gov/research-topics/medications-to-treat-opioid-addiction',
  'Hotlines': 'https://988lifeline.org/',
  'Support Groups': 'https://library.samhsa.gov/product/substance-abuse-treatment-group-therapy/sma15-4024',
};

export const EDUCATION_CATEGORIES = [
  { id: 'understanding', title: 'Understanding Addiction', icon: 'Brain', articles: ['What is SUD?', 'Brain Science', 'Common Myths'] },
  { id: 'stages', title: 'Recovery Stages', icon: 'ShieldAlert', articles: ['Early Recovery', 'Maintenance', 'What to Expect'] },
  { id: 'caregiver', title: 'Supporting a Loved One', icon: 'HeartHandshake', articles: ['Setting Boundaries', 'Self-Care', 'Avoiding Enabling'] },
  { id: 'meds', title: 'Treatment Options', icon: 'Pill', articles: ['Types of Treatment', 'MAT Overview'] },
  { id: 'resources', title: 'Local Resources', icon: 'Phone', articles: ['Hotlines', 'Support Groups'] },
] as const;

export const CAREGIVER_ARTICLES = [
  { id: 'relapse-talk', title: 'How to talk about a relapse', icon: 'HeartHandshake' },
  { id: 'boundaries', title: 'Setting healthy boundaries', icon: 'ShieldAlert' },
  { id: 'understanding', title: 'Understanding what they are going through', icon: 'BookOpen' },
] as const;

export const ONBOARDING_TOTAL_STEPS = 5;

export const ONBOARDING_STEP_PROMPTS = [
  'Welcome to RecoverAI',
  "What's your first name?",
  'What brings you here today?',
  'Which substances are you concerned about?',
  'Add an emergency contact.',
] as const;

export const ONBOARDING_ROLE_OPTIONS = [
  { value: 'recovery', label: "I'm in recovery", desc: 'Managing my own substance use', icon: 'Sprout' },
  { value: 'caregiver', label: "I'm a caregiver", desc: 'Supporting someone I love', icon: 'Heart' },
] as const;

export const BREATHING_EXERCISE_STEPS = [
  'Inhale (4s)',
  'Hold (4s)',
  'Exhale (4s)',
  'Hold (4s)',
] as const;

export const GROUNDING_SENSE_STEPS = [
  { count: '5', text: 'things you can see' },
  { count: '4', text: 'things you can feel' },
  { count: '3', text: 'things you can hear' },
  { count: '2', text: 'things you can smell' },
  { count: '1', text: 'thing you can taste' },
] as const;

export const INPUT_LIMITS = {
  FIRST_NAME_MAX_LENGTH: 50,
  CONTACT_NAME_MAX_LENGTH: 60,
} as const;

export const SETTINGS_COPY = {
  RESET_CONFIRM: 'Are you sure you want to reset all your data? This cannot be undone.',
  VERSION_LABEL: 'RecoverAI v1.0.0',
} as const;

// India emergency numbers
export const EMERGENCY_NUMBER = '112';
export const EMERGENCY_TEL = 'tel:112';
export const CRISIS_HOTLINE = '14416';
export const CRISIS_HOTLINE_TEL = 'tel:14416';
export const CRISIS_HOTLINE_LABEL = '14416 (Tele-MANAS)';
