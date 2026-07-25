// app/api/gemini/route.ts — Server-side Route Handler (API key never reaches the browser)
import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const FALLBACK =
  "I'm here for you. Please call 988 if you need immediate help.";

export async function POST(req: NextRequest) {
  try {
    const { systemPrompt, userMessage, maxTokens = 300 } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return NextResponse.json({ text: FALLBACK }, { status: 200 });
    }

    const res = await fetch(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
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
            temperature: 0.7,
          },
        }),
      }
    );

    if (!res.ok) {
      console.error('Gemini API error:', res.status);
      return NextResponse.json({ text: FALLBACK }, { status: 200 });
    }

    const data = await res.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ?? FALLBACK;

    return NextResponse.json({ text });
  } catch (err) {
    console.error('Gemini route handler error:', err);
    return NextResponse.json({ text: FALLBACK }, { status: 200 });
  }
}
