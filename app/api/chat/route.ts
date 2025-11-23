import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { retryWithExponentialBackoff } from "../../lib/ai/retry";
import { responseSchema } from "@/app/lib/ai/schema";

const MODEL = 'gemini-2.5-flash';

export async function POST(req: Request) {
    try {
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY not set" },
                { status: 500 });
        }

        const { messages } = await req.json();

        const ai = new GoogleGenAI({
            apiKey: API_KEY,
        });
        const contents = messages.map((m: any) => {
            // 確実に文字列としてトリム（前後の空白除去）し、空でないか確認
            const textValue = String(m.text).trim();

            // Partの配列を生成
            const parts = [];

            if (textValue.length > 0) {
                // テキストが存在する場合のみ、Partオブジェクトを追加
                parts.push({ text: textValue });
            }

            return {
                role: m.role === "assistant" ? "model" : "user",
                parts: parts, // parts 配列には有効な Part オブジェクトのみが含まれる
            };
        }).filter((c: { parts: string | any[]; }) => c.parts.length > 0); // 👈 Partsが空になった Content は配列から除外する

        const apiCall = () => ai.models.generateContent({
            model: MODEL,
            contents: contents,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            }
        });

        const result = await retryWithExponentialBackoff(apiCall, 5);
        const jsonString = result.text;
        const jsonObject = JSON.parse(jsonString);
        // const jsonText = result.outputText();
        // const parsed = JSON.parse(jsonText);
        return NextResponse.json(jsonObject);

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "Error generating content" },
            { status: 500 }
        );
    }
}