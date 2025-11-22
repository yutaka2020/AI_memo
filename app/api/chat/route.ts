import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { retryWithExponentialBackoff } from "../../lib/retry";

const MODEL = 'gemini-2.5-flash';

export async function POST(req: Request) {
    try {
        const API_KEY = process.env.GEMINI_API_KEY as string | undefined;

        if (!API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY not set" },
                { status: 500 });
        }

        const { messages } = await req.json();

        const ai = new GoogleGenAI({
            apiKey: API_KEY!,
        });

        const contents = messages.map((m: any) => {
            let roleValue = String(m.role).toLowerCase().trim();

            if (roleValue === 'assistant' || roleValue === 'bot') {
                roleValue = 'model';
            }

            return {
                role: roleValue,
                parts: [{ text: m.text }],
            }
        });

        const apiCall = () => ai.models.generateContent({
            model: MODEL,
            contents: contents,
        });

        const result = await retryWithExponentialBackoff(apiCall, 5);
        const text = result.text;

        return NextResponse.json({ reply: text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "Error generating content" },
            { status: 500 }
        );
    }
}