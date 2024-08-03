import { Extension } from '@tiptap/core';
import CharacterCount from '@tiptap/extension-character-count';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import { Content, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { useTranslation } from 'react-i18next';
import { SlashCommand } from '../extensions/SlashCommand/index.js';
export { Heading } from '@tiptap/extension-heading';
export { TaskItem } from '@tiptap/extension-task-item';

export const useBlockEditor = ({
  initialContent,
  ref,
}: {
  initialContent: Content;
  ref: React.RefObject<HTMLButtonElement>;
}) => {
  const { t } = useTranslation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
          HTMLAttributes: {
            class: 'heading',
          },
        },
      }),
      Underline,
      CharacterCount,
      Placeholder.configure({ placeholder: t('write_the_text') }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      TaskItem.configure({
        nested: true,
      }),
      SlashCommand(t),
      Extension.create({
        addKeyboardShortcuts() {
          return {
            'Mod-s': () => {
              ref.current?.click();
              return true;
            },
          };
        },
      }),
    ],
    content: initialContent,
  });

  return { editor };
};
