import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

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

        const contents = messages.map((m: any) => ({
            role: m.role,
            parts: [{ text: m.text }],
        }));

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // 使用したいモデルを指定
            contents: contents,         // 作成した contents 配列を渡す
        });
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