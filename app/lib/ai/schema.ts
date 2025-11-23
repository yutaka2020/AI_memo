import { Type } from '@google/genai';

export const responseSchema = {
    type: Type.OBJECT,
    properties: {
        reply: {
            type: Type.STRING,
            description: "ユーザーに対して直接返す、自然で親しみやすい会話形式の返答文。"
        },
        memo: {
            type: Type.STRING,
            description: "今回の会話全体から得られた、重要なポイントや結論を簡潔にまとめたメモ。"
        }
    },
    required: ["reply", "memo"]
}