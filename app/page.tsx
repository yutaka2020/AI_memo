"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
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
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1 max-w-2xl w-full mx-auto pt-10 px-4 space-y-4">

        {/* チャットログ */}
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${m.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-white border border-slate-200 text-gray-800"
                }`}
            >
              {m.text}
            </div>
          ))}

          {loading && (
            <div className="mr-auto bg-white border border-slate-200 max-w-[80%] rounded-lg px-3 py-2 text-sm text-slate-500">
              …
            </div>
          )}
        </div>

        {/* 入力フォーム */}
        <div className="flex gap-2 border-black">
          <textarea
            rows={2}
            className="flex-1 border border-slate-300 rounded-lg p-2 text-sm text-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力"
          />

          <button
            className={`px-4 py-2 rounded-lg text-white text-sm ${loading ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-500"
              }`}
            onClick={sendMessage}
          >
            送信
          </button>
        </div>
      </main>
    </div>
  );
}
