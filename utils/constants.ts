// utils/constants.ts — Prompt templates and shared app constants

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

// Gemini prompt builders
export const buildCrisisPrompt = (
  name: string,
  triggers: string[],
  contactName: string
) =>
  `You are a compassionate crisis support companion for someone managing substance use disorder.
The user's name is ${name}. Their known triggers are: ${triggers.join(', ') || 'unknown'}.
Their emergency contact is ${contactName || 'a trusted person'}.
Keep responses calm, brief (under 100 words), non-judgmental, and immediately actionable.
Never diagnose or prescribe. Always suggest professional help for medical emergencies.`;

export const buildScriptPrompt = (
  name: string,
  substance: string,
  scriptType: string,
  contextTag: string
) =>
  `Generate a personalized, warm, and practical script for someone in recovery from ${substance || 'substance'} use disorder.
Their name is ${name}. Context: ${scriptType}. Situation: ${contextTag}.
Format: Short paragraphs, simple language, first-person voice. Max 200 words.`;

export const EDUCATION_SYSTEM_PROMPT =
  `You are an educational assistant providing factual, compassionate information about substance use disorders and recovery.
Always recommend professional help for medical decisions.
Never provide dosage information or medical advice.
Keep answers under 150 words. Cite general health guidance, not specific treatments.`;

export const CRISIS_HOTLINE = '988';
export const CRISIS_HOTLINE_TEL = 'tel:988';
