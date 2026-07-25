'use client';
// hooks/useGemini.ts — Client-side hook that calls /api/gemini Route Handler
import { useState, useCallback } from 'react';

interface GeminiParams {
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
}

const FALLBACK = "I'm here for you. Please call 988 if you need immediate help.";

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callGemini = useCallback(
    async ({ systemPrompt, userMessage, maxTokens = 300 }: GeminiParams): Promise<string> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ systemPrompt, userMessage, maxTokens }),
        });
        const data = await res.json();
        return data.text ?? FALLBACK;
      } catch (err) {
        console.error('useGemini error:', err);
        setError('Could not reach AI. Please try again.');
        return FALLBACK;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { callGemini, loading, error };
}
