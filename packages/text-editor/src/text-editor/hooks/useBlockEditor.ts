import { Extension } from '@tiptap/core';
import CharacterCount from '@tiptap/extension-character-count';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { common, createLowlight } from 'lowlight';
import { useTranslation } from 'react-i18next';
import {
  CodeBlockLowlight,
  HorizontalRule,
  ImageBlock,
  // ImageUpload,
  Link,
  SlashCommand,
} from '../extensions/index';

const lowlight = createLowlight(common);

type UseBlockEditorProps = {
  initialContent: string;
  extensions?: Extension[];
};

export const useBlockEditor = ({ initialContent, extensions = [] }: UseBlockEditorProps) => {
  const { t } = useTranslation();

  const editor = useEditor({
    onCreate: ({ editor }) => {
      editor.commands.setContent(initialContent);
      editor.commands.focus('start', { scrollIntoView: true });
    },
    extensions: [
      Underline,
      CharacterCount,
      Placeholder.configure({ placeholder: `${t('write_the_text')}…` }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      HorizontalRule,
      StarterKit.configure({
        heading: false,
        horizontalRule: false,
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      // ImageUpload,
      ImageBlock,
      SlashCommand(t),
      ...extensions,
    ],
  });

  const characterCount = editor?.storage.characterCount || { characters: () => 0 };
  return { editor, characterCount };
};
