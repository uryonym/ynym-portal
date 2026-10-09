import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'

import {
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  List,
  ListOrdered,
  Quote,
  Code,
  Table as TableIcon,
  Minus,
} from 'lucide-react'

import type { Editor, Range } from '@tiptap/core'

export interface SlashCommandItem {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  command: (params: { editor: Editor; range: Range }) => void
}

export const defaultSlashCommands: SlashCommandItem[] = [
  {
    title: '見出し 1',
    description: '大見出しを挿入',
    icon: Heading1,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run()
    },
  },
  {
    title: '見出し 2',
    description: '中見出しを挿入',
    icon: Heading2,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run()
    },
  },
  {
    title: '見出し 3',
    description: '小見出しを挿入',
    icon: Heading3,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run()
    },
  },
  {
    title: 'ToDo リスト',
    description: 'チェックボックス付きのリスト',
    icon: CheckSquare,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    },
  },
  {
    title: '箇条書きリスト',
    description: 'シンプルな黒丸リスト',
    icon: List,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: '番号付きリスト',
    description: '連番のステップリスト',
    icon: ListOrdered,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: '引用',
    description: 'メモや強調の引用ブロック',
    icon: Quote,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
  },
  {
    title: 'コードブロック',
    description: 'プログラムや等幅テキスト',
    icon: Code,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    },
  },
  {
    title: 'テーブル',
    description: '3×3 の表を挿入',
    icon: TableIcon,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run()
    },
  },
  {
    title: '区切り線',
    description: 'セクションを分ける水平線',
    icon: Minus,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
]

export interface SlashCommandMenuRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

export interface SlashCommandMenuProps {
  items: SlashCommandItem[]
  command: (item: SlashCommandItem) => void
}

export const SlashCommandMenu = forwardRef<
  SlashCommandMenuRef,
  SlashCommandMenuProps
>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    setSelectedIndex(0)
  }, [items])

  const selectItem = (index: number) => {
    command(items[index])
  }

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((prev) => (prev <= 0 ? items.length - 1 : prev - 1))
        return true
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((prev) => (prev >= items.length - 1 ? 0 : prev + 1))
        return true
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex)
        return true
      }
      return false
    },
  }))

  if (items.length === 0) {
    return (
      <div className="z-50 min-w-48 overflow-hidden rounded-xl border border-slate-200/90 bg-white p-2 text-sm text-slate-500 shadow-xl">
        一致するコマンドがありません
      </div>
    )
  }

  return (
    <div className="z-50 min-w-60 max-h-72 overflow-y-auto rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-xs p-1 shadow-xl">
      <div className="px-2 py-1 text-[11px] font-semibold text-slate-400">
        基本ブロック
      </div>
      {items.map((item, index) => {
        const Icon = item.icon
        const isSelected = index === selectedIndex
        return (
          <button
            key={item.title}
            type="button"
            onClick={() => selectItem(index)}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors cursor-pointer ${
              isSelected
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${
                isSelected
                  ? 'border-slate-800 bg-slate-800 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-xs leading-none">
                {item.title}
              </span>
              <span
                className={`text-[11px] truncate mt-0.5 ${
                  isSelected ? 'text-slate-300' : 'text-slate-400'
                }`}
              >
                {item.description}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
})

SlashCommandMenu.displayName = 'SlashCommandMenu'
