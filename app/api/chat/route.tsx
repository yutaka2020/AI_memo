import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const API_KEY = process.env.GEMINI_API_KEY as string | undefined;

        if (!API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY not set" },
                { status: 500 });
        }

        const ai = new GoogleGenerativeAI(API_KEY);
        const { prompt } = await req.json();
        const model = ai.getGenerativeModel({
            model: "gemini-2.5-flash",
        })

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({ reply: text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "Error generating content" },
            { status: 500 }
        );
    }
}