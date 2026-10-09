import { BubbleMenu } from '@tiptap/react/menus'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Heading1,
  Heading2,
} from 'lucide-react'

import type { Editor } from '@tiptap/react'

interface BubbleToolbarProps {
  editor: Editor | null
}

export function BubbleToolbar({ editor }: BubbleToolbarProps) {
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

  return (
    <BubbleMenu
      editor={editor}
      className="flex items-center gap-0.5 p-1 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-lg shadow-lg text-slate-700 animate-in fade-in-0 zoom-in-95 duration-100"
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('heading', { level: 1 })
            ? 'bg-slate-900 text-white'
            : 'hover:bg-slate-100'
        }`}
        title="見出し 1"
      >
        <Heading1 className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-slate-900 text-white'
            : 'hover:bg-slate-100'
        }`}
        title="見出し 2"
      >
        <Heading2 className="h-3.5 w-3.5" />
      </button>

      <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('bold')
            ? 'bg-slate-900 text-white'
            : 'hover:bg-slate-100'
        }`}
        title="太字"
      >
        <Bold className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('italic')
            ? 'bg-slate-900 text-white'
            : 'hover:bg-slate-100'
        }`}
        title="斜体"
      >
        <Italic className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('strike')
            ? 'bg-slate-900 text-white'
            : 'hover:bg-slate-100'
        }`}
        title="取り消し線"
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('code')
            ? 'bg-slate-900 text-white'
            : 'hover:bg-slate-100'
        }`}
        title="インラインコード"
      >
        <Code className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={setLink}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          editor.isActive('link')
            ? 'bg-slate-900 text-white'
            : 'hover:bg-slate-100'
        }`}
        title="リンク"
      >
        <LinkIcon className="h-3.5 w-3.5" />
      </button>
    </BubbleMenu>
  )
}
