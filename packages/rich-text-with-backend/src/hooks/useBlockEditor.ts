import { Extension } from '@tiptap/core';
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
  ImageUpload,
  Link,
  SlashCommand,
} from '../extensions/index';

const lowlight = createLowlight(common);

type UseBlockEditorProps = {
  initialContent: string;
  extensions?: Extension[];
  immediatelyRender: boolean;
  language: string;
};

export const useBlockEditor = ({
  initialContent,
  extensions = [],
  immediatelyRender,
  language,
}: UseBlockEditorProps) => {
  const { t } = useTranslation();

  const editor = useEditor({
    onCreate: ({ editor }) => {
      editor.commands.setContent(initialContent);
      editor.commands.focus('start', { scrollIntoView: true });
    },

    extensions: [
      Underline,
      Placeholder.configure({ placeholder: `${t('write_the_text', { lng: language })}...` }),
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
      ImageUpload,
      ImageBlock,
      SlashCommand(t),
      ...extensions,
    ],
    immediatelyRender,
  });

  return { editor };
};
