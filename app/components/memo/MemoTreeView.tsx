"use client";
import { MemoNode } from "@/app/lib/types/memo";

export function MemoTreeView({
  nodes,
  onAddChild,
  onEdit,
  onSelect,
  onToggle,
}: {
  nodes: MemoNode[];
  onAddChild: (id: string) => void;
  onEdit: (id: string) => void;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <ul className="ml-2 space-y-1">
      {nodes.map((node) => (
        <li key={node.id}>
          <div className="flex items-center gap-1">

            {/* 開閉用のボタン */}
            <button
              className="text-xs text-gray-600 w-4"
              onClick={() => onToggle(node.id)}
            >
              {node.children.length > 0 ? (node.isOpen ? "▼" : "▶") : ""}
            </button>

            {/* タイトル（ダブルクリックで選択） */}
            <span
              className="cursor-pointer bg-gray-800 px-2 py-1 rounded flex-1"
              onDoubleClick={() => onSelect(node.id)}
            >
              {node.title}
            </span>

            {/* 子追加 */}
            <button
              className="text-xs text-blue-600"
              onClick={() => onAddChild(node.id)}
            >
              + 子
            </button>

            {/* タイトル編集 */}
            <button
              className="text-xs text-gray-500"
              onClick={() => onEdit(node.id)}
            >
              編集
            </button>
          </div>

          {/* ★ isOpen が true のときだけ子ノードを表示 */}
          {node.isOpen && node.children.length > 0 && (
            <MemoTreeView
              nodes={node.children}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
