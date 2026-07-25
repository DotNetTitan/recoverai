'use client';
import { useState, useCallback } from 'react';

interface GeminiParams {
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
}

const FALLBACK = "I'm here for you. Please call 14416 (Tele-MANAS) if you need immediate help.";

const cache = new Map<string, string>();

function cacheKey(systemPrompt: string, userMessage: string, maxTokens: number): string {
  return `${systemPrompt}||${userMessage}||${maxTokens}`;
}

const CACHE_SIZE_LIMIT = 50;

/**
 * Hook that provides a `callGemini` function to interact with the `/api/gemini` route handler.
 * Manages `loading` and `error` state. Returns a fallback safe message on any failure.
 * Responses are cached in-memory per session; repeated identical prompts skip the API call.
 */
export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callGemini = useCallback(
    async ({ systemPrompt, userMessage, maxTokens = 300 }: GeminiParams): Promise<string> => {
      const key = cacheKey(systemPrompt, userMessage, maxTokens);
      const cached = cache.get(key);
      if (cached !== undefined) return cached;

      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ systemPrompt, userMessage, maxTokens }),
        });
        const data = await res.json();
        const text = data.text ?? FALLBACK;
        if (cache.size >= CACHE_SIZE_LIMIT) cache.clear();
        cache.set(key, text);
        return text;
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
