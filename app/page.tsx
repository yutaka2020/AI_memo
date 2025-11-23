"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [memo, setMemo] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user" as const, text: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    const aiMessage = { role: "assistant" as const, text: data.reply };

    setMessages((prev) => [...prev, aiMessage]);
    setMemo(data.memo)
    setLoading(false);

    console.log("API Response:", data);

  };

  return (
    <div className="flex min-h-screen">
      {/* 左：チャット */}
      <div className="flex-1 border-r p-4 flex flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[70%] rounded px-3 py-2 ${m.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-gray-200"
                }`}
            >
              {m.text}
            </div>
          ))}

          {loading && (
            <div className="mr-auto bg-gray-200 px-3 py-2 rounded">
              …
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <textarea
            rows={2}
            className="flex-1 border rounded p-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            送信
          </button>
        </div>
      </div>

      {/* 右：メモ */}
      <div className="w-80 p-4 bg-gray-50">
        <h2 className="text-lg font-bold mb-2">メモ</h2>
        <p className="whitespace-pre-wrap text-sm text-gray-800">
          {memo || "まだメモはありません"}
        </p>
      </div>
    </div>
  );
}
