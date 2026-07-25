// app/api/gemini/route.ts — Server-side Route Handler (API key never reaches the browser)
import { NextRequest, NextResponse } from 'next/server';
import { AI_CONFIG, AI_FALLBACK_MESSAGE } from '@/utils/constants';

export async function POST(req: NextRequest) {
  try {
    const { systemPrompt, userMessage, maxTokens = AI_CONFIG.DEFAULT_MAX_TOKENS } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return NextResponse.json({ text: AI_FALLBACK_MESSAGE }, { status: 200 });
    }

    const res = await fetch(
      `${AI_CONFIG.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }],
            },
          ],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: AI_CONFIG.GEMINI_TEMPERATURE,
          },
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Gemini API error:', res.status, errorText);
      
      // Specific message for rate limiting
      if (res.status === 429) {
        return NextResponse.json({ 
          text: "The AI service is temporarily busy. Please wait a moment and try again." 
        }, { status: 200 });
      }
      
      return NextResponse.json({ text: AI_FALLBACK_MESSAGE }, { status: 200 });
    }

    const data = await res.json();
    
    // Log finish reason for debugging
    const finishReason = data.candidates?.[0]?.finishReason;
    if (finishReason === 'MAX_TOKENS') {
      console.warn('[gemini] Response cut off due to MAX_TOKENS. Consider increasing maxTokens.');
    }
    
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ?? AI_FALLBACK_MESSAGE;

    return NextResponse.json({ text });
  } catch (err) {
    console.error('Gemini route handler error:', err instanceof Error ? err.message : err);
    console.error('Full error:', err);
    return NextResponse.json({ text: AI_FALLBACK_MESSAGE }, { status: 200 });
  }
}
