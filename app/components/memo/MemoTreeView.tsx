"use client";
import { MemoNode } from "@/app/lib/types/memo";

export function MemoTreeView({ nodes, onAddChild, onEdit }: {
  nodes: MemoNode[];
  onAddChild: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  return (
    <ul className="ml-2 space-y-1">
      {nodes.map((node) => (
        <li key={node.id}>
          <div className="flex items-center gap-2">
            <span
              className="cursor-pointer bg-gray-700 px-2 py-1 rounded"
              onDoubleClick={() => onEdit(node.id)}
            >
              {node.title}
            </span>

            <button
              className="text-xs text-blue-600"
              onClick={() => onAddChild(node.id)}
            >
              + 子
            </button>
          </div>

          {node.children.length > 0 && (
            <MemoTreeView
              nodes={node.children}
              onAddChild={onAddChild}
              onEdit={onEdit}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
