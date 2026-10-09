import { useEffect, useRef } from 'react'

import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'

import { BubbleToolbar } from './BubbleToolbar'
import { EditorToolbar } from './EditorToolbar'
import { SlashCommand } from './extensions/slash-command'

import './editor.css'

interface TipTapEditorProps {
  content: string
  onChange?: (markdown: string) => void
  placeholder?: string
  editable?: boolean
  autoFocus?: boolean
  className?: string
  showToolbar?: boolean
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "何を書きますか？ '/' でコマンドを表示...",
  editable = true,
  autoFocus = false,
  className = '',
  showToolbar = true,
}: TipTapEditorProps) {
  const isUpdatingRef = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Markdown.configure({
        html: true,
        tightLists: true,
        linkify: true,
        breaks: false,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      SlashCommand,
    ],
    content,
    editable,
    autofocus: autoFocus,
    onUpdate: ({ editor: ed }) => {
      if (onChange) {
        isUpdatingRef.current = true
        const markdown = (ed.storage as any).markdown?.getMarkdown() ?? ''
        onChange(markdown)
        setTimeout(() => {
          isUpdatingRef.current = false
        }, 50)
      }
    },
  })

  // 親から渡された content が外部更新された場合の同期
  useEffect(() => {
    if (isUpdatingRef.current) return

    const currentMarkdown =
      (editor.storage as any).markdown?.getMarkdown() ?? ''
    if (currentMarkdown !== content) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [content, editor])

  // editable 状態の同期
  useEffect(() => {
    if (editor.isEditable !== editable) {
      editor.setEditable(editable)
    }
  }, [editable, editor])

  return (
    <div
      className={`relative w-full rounded-xl border border-slate-200/80 bg-white shadow-2xs transition-all ${className}`}
    >
      {editable && showToolbar && <EditorToolbar editor={editor} />}
      {editable && <BubbleToolbar editor={editor} />}

      <div className="p-4 sm:p-6 min-h-[350px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
