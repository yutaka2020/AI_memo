"use client";

import { useState } from "react";
import { MemoNode } from "@/app/lib/types/memo";
import { MemoTreeView } from "@/app/components/memo/MemoTreeView";

export default function Home() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [memo, setMemo] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [memoTree, setMemoTree] = useState<MemoNode[]>([]);

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
    setMemo((prev) => prev + "\n" + data.memo);
    setLoading(false);

    console.log("API Response:", data);

  };

  const addRootNode = () => {
    const title = prompt("新しい項目名");
    if (!title) return;

    setMemoTree((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, children: [] }
    ]);
  };

  const addChildNode = (parentId: string) => {
    const title = prompt("追加する内容");
    if (!title) return;

    const addRecursive = (nodes: MemoNode[]): MemoNode[] => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [
              ...node.children,
              { id: crypto.randomUUID(), title, children: [] }
            ]
          };
        }

        return { ...node, children: addRecursive(node.children) };
      });
    };

    setMemoTree((prev) => addRecursive(prev));
  };

  const editNode = (nodeId: string) => {
    const newText = prompt("内容を編集");
    if (!newText) return;

    const updateRecursive = (nodes: MemoNode[]): MemoNode[] => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, title: newText };
        }
        return { ...node, children: updateRecursive(node.children) };
      });
    };

    setMemoTree((prev) => updateRecursive(prev));
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
                : "mr-auto bg-gray-800"
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
      <div className="w-80 p-4 bg-gray-80 overflow-y-auto">
        <h2 className="text-lg font-bold mb-2">メモ</h2>

        <button
          onClick={addRootNode}
          className="mb-2 text-sm bg-blue-500 text-white px-3 py-1 rounded"
        >
          + 親ノード追加
        </button>

        <MemoTreeView
          nodes={memoTree}
          onAddChild={addChildNode}
          onEdit={editNode}
        />
      </div>
    </div>
  );
}
