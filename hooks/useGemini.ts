'use client';
import { useState, useCallback } from 'react';
import { AI_CONFIG, AI_ERROR_MESSAGE, AI_FALLBACK_MESSAGE } from '@/utils/constants';

interface GeminiParams {
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
}

const cache = new Map<string, string>();

function cacheKey(systemPrompt: string, userMessage: string, maxTokens: number): string {
  return `${systemPrompt}||${userMessage}||${maxTokens}`;
}

/**
 * Hook that provides a `callGemini` function to interact with the `/api/gemini` route handler.
 * Manages `loading` and `error` state. Returns a fallback safe message on any failure.
 * Responses are cached in-memory per session; repeated identical prompts skip the API call.
 */
export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callGemini = useCallback(
    async ({ systemPrompt, userMessage, maxTokens = AI_CONFIG.DEFAULT_MAX_TOKENS }: GeminiParams): Promise<string> => {
      const key = cacheKey(systemPrompt, userMessage, maxTokens);
      const cached = cache.get(key);
      if (cached !== undefined) return cached;

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(AI_CONFIG.API_ROUTE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ systemPrompt, userMessage, maxTokens }),
        });
        const data = await res.json();
        const text = data.text ?? AI_FALLBACK_MESSAGE;
        if (cache.size >= AI_CONFIG.CACHE_SIZE_LIMIT) cache.clear();
        cache.set(key, text);
        return text;
      } catch (err) {
        console.error('useGemini error:', err);
        setError(AI_ERROR_MESSAGE);
        return AI_FALLBACK_MESSAGE;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const resetError = useCallback(() => setError(null), []);

  return { callGemini, loading, error, resetError };
}
