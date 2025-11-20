"use client";

import { useState } from "react";


export default function Home() {
  const [message, setMessage] = useState("")
  const [reply, setReply] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!message.trim || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message }),
      });

      if (!res.ok) {
        setReply("エラーが発生しました。");
        return;
      }

      const data = await res.json();
      setReply(data.reply ?? "（返答なし）");

    } catch (e) {
      console.error(e);
      setReply("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pl-5">
      <div>
        <header>
          <h1 className="text-3xl font-bold underline">AI memo</h1>
          <p>test</p>
        </header>
        <main className="lex-1 space-y-6">
          <section>
            <h2>メッセージ入力</h2>
            <textarea placeholder="AIに聞きたいこと・相談したいことを書いてみてください。"
              onKeyDown={handleKeyDown} value={message} onChange={(e) => setMessage(e.target.value)} />
            <div>
              <button type="button"
                onClick={handleSend}
                disabled={loading || !message.trim()}
                className={`ounded-lg px-4 py-1.5 text-xs font-medium text-white transition
              ${loading || !message.trim()
                    ? "cursor-not-allowed bg-slate-300"
                    : "bg-blue-600 hover:bg-blue-500"
                  }`}>{loading ? "送信中…" : "送信"}</button>
            </div>
          </section>

          <section className="flex-1 rounded-xl bg-white p-4 shadow-sm shadow-slate-200">
            <h2 className="mb-2 text-sm font-medium text-slate-700">
              AIの返答
            </h2>
            <div className="min-h-[120px] whitespace-pre-wrap rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-800">
              {reply
                ? reply
                : "まだメッセージは送っていません。上のテキストエリアに入力して「送信」を押すと、ここにAIの返答が表示されます。"}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}