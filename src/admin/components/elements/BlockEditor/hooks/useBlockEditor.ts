import { FileHandler } from '@tiptap-pro/extension-file-handler';
import { Content, Extension } from '@tiptap/core';
import CharacterCount from '@tiptap/extension-character-count';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../../utilities/logger.js';
import { uploadFile } from '../../../../utilities/api.js';
import { ImageBlock } from '../extensions/ImageBlock/ImageBlock.js';
import ImageUpload from '../extensions/ImageUpload/ImageUpload.js';
import { SlashCommand } from '../extensions/SlashCommand/index.js';

export const useBlockEditor = ({
  initialContent,
  ref,
}: {
  initialContent: Content;
  ref: React.RefObject<HTMLButtonElement>;
}) => {
  const { t } = useTranslation();

  const editor = useEditor({
    onCreate: ({ editor }) => {
      editor.commands.setContent(initialContent);
      editor.commands.focus('start', { scrollIntoView: true });
    },
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
      ImageUpload,
      ImageBlock,
      FileHandler.configure({
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        onDrop: async (currentEditor, files, pos) => {
          for (const file of files) {
            try {
              const result = await uploadFile(file);
              currentEditor
                .chain()
                .setImageBlockAt({
                  pos,
                  src: result.files[0].url,
                })
                .focus()
                .run();
            } catch (error) {
              logger.error(error);
            }
          }
        },
        onPaste: async (currentEditor, files) => {
          for (const file of files) {
            try {
              const result = await uploadFile(file);
              currentEditor
                .chain()
                .setImageBlockAt({
                  pos: currentEditor.state.selection.anchor,
                  src: result.files[0].url,
                })
                .focus()
                .run();
            } catch (error) {
              logger.error(error);
            }
          }
        },
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
  });

  return { editor };
};
