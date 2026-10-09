import { Extension } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import Suggestion from '@tiptap/suggestion'

import { SlashCommandMenu, defaultSlashCommands } from '../SlashCommandMenu'

import type { SlashCommandItem, SlashCommandMenuRef } from '../SlashCommandMenu'
import type {
  SuggestionProps,
  SuggestionKeyDownProps,
} from '@tiptap/suggestion'

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({
          editor,
          range,
          props,
        }: {
          editor: any
          range: any
          props: SlashCommandItem
        }) => {
          props.command({ editor, range })
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          return defaultSlashCommands.filter((item) => {
            const q = query.toLowerCase().trim()
            if (!q) return true
            return (
              item.title.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q)
            )
          })
        },
        render: () => {
          let component: ReactRenderer<SlashCommandMenuRef> | null = null
          let unmount: (() => void) | null = null

          return {
            onStart: (props: SuggestionProps<SlashCommandItem>) => {
              component = new ReactRenderer(SlashCommandMenu, {
                props,
                editor: props.editor,
              })

              unmount = props.mount(component.element)
            },

            onUpdate: (props: SuggestionProps<SlashCommandItem>) => {
              component?.updateProps(props)
            },

            onKeyDown: (props: SuggestionKeyDownProps) => {
              if (props.event.key === 'Escape') {
                unmount?.()
                return true
              }

              return component?.ref?.onKeyDown(props) ?? false
            },

            onExit: () => {
              unmount?.()
              component?.destroy()
              component = null
              unmount = null
            },
          }
        },
      }),
    ]
  },
})
