import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Table as TableIcon,
  Minus,
  Undo2,
  Redo2,
  Link as LinkIcon,
} from 'lucide-react'

import type { Editor } from '@tiptap/react'

interface EditorToolbarProps {
  editor: Editor | null
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URLを入力してください:', previousUrl)

    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run()
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-slate-200/80 bg-slate-50/70 rounded-t-xl text-slate-700">
      {/* Undo / Redo */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-1.5 rounded-md hover:bg-slate-200/70 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
        title="元に戻す (Ctrl+Z)"
      >
        <Undo2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-1.5 rounded-md hover:bg-slate-200/70 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
        title="やり直す (Ctrl+Shift+Z)"
      >
        <Redo2 className="h-4 w-4" />
      </button>

      <div className="w-[1px] h-4 bg-slate-200 mx-1" />

      {/* Headings */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('heading', { level: 1 })
            ? 'bg-slate-900 text-white shadow-xs'
            : 'hover:bg-slate-200/70'
        }`}
        title="見出し 1"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-slate-900 text-white shadow-xs'
            : 'hover:bg-slate-200/70'
        }`}
        title="見出し 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('heading', { level: 3 })
            ? 'bg-slate-900 text-white shadow-xs'
            : 'hover:bg-slate-200/70'
        }`}
        title="見出し 3"
      >
        <Heading3 className="h-4 w-4" />
      </button>

      <div className="w-[1px] h-4 bg-slate-200 mx-1" />

      {/* Basic Marks */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('bold')
            ? 'bg-slate-900 text-white shadow-xs'
            : 'hover:bg-slate-200/70'
        }`}
        title="太字 (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('italic')
            ? 'bg-slate-900 text-white shadow-xs'
            : 'hover:bg-slate-200/70'
        }`}
        title="斜体 (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('strike')
            ? 'bg-slate-900 text-white shadow-xs'
            : 'hover:bg-slate-200/70'
        }`}
        title="取り消し線"
      >
        <Strikethrough className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('code')
            ? 'bg-slate-900 text-white shadow-xs'
            : 'hover:bg-slate-200/70'
        }`}
        title="インラインコード"
      >
        <Code className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={setLink}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('link')
            ? 'bg-slate-900 text-white shadow-xs'
            : 'hover:bg-slate-200/70'
        }`}
        title="リンク設定"
      >
        <LinkIcon className="h-4 w-4" />
      </button>

      <div className="w-[1px] h-4 bg-slate-200 mx-1" />

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('bulletList')
            ? 'bg-slate-900 text-white shadow-xs'
            : 'hover:bg-slate-200/70'
        }`}
        title="箇条書きリスト"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('orderedList')
            ? 'bg-slate-900 text-white shadow-xs'
            : 'hover:bg-slate-200/70'
        }`}
        title="番号付きリスト"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('taskList')
            ? 'bg-slate-900 text-white shadow-xs'
            : 'hover:bg-slate-200/70'
        }`}
        title="ToDo チェックリスト"
      >
        <CheckSquare className="h-4 w-4" />
      </button>

      <div className="w-[1px] h-4 bg-slate-200 mx-1" />

      {/* Blocks */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('blockquote')
            ? 'bg-slate-900 text-white shadow-xs'
            : 'hover:bg-slate-200/70'
        }`}
        title="引用"
      >
        <Quote className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={insertTable}
        className="p-1.5 rounded-md hover:bg-slate-200/70 transition-colors cursor-pointer"
        title="テーブル挿入 (3x3)"
      >
        <TableIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-1.5 rounded-md hover:bg-slate-200/70 transition-colors cursor-pointer"
        title="区切り線"
      >
        <Minus className="h-4 w-4" />
      </button>
    </div>
  )
}
