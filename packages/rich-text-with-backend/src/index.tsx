import { Placeholder } from '@tiptap/extension-placeholder';
import { EditorContent, JSONContent } from '@tiptap/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlockEditor } from './hooks/useBlockEditor';
import i18n from './locales/localization';
import './styles/index.css';

type Props = {
  initialContent?: string;
  options?: {
    language?: 'en' | 'ja';
    immediatelyRender?: boolean;
  };
  onChange?: ({
    body,
    bodyHtml,
    bodyJson,
  }: {
    body: string;
    bodyHtml: string;
    bodyJson: JSONContent;
  }) => void;
};

export const RichText = ({
  initialContent = '',
  options = { language: 'en' },
  onChange,
}: Props) => {
  const { t } = useTranslation();
  const { editor } = useBlockEditor({
    initialContent,
    extensions: [
      Placeholder.configure({
        placeholder: t('editor.placeholder'),
      }),
    ],
    immediatelyRender: options.immediatelyRender ?? true,
  });

  editor?.on('update', () => {
    onChange?.({
      body: editor.getText(),
      bodyHtml: editor.getHTML(),
      bodyJson: editor.getJSON(),
    });
  });

  // on mount
  useEffect(() => {
    if (options.language) {
      i18n.changeLanguage(options.language);
    }

    const style = document.createElement('style');
    style.textContent = `
      .ProseMirror {
        &.ProseMirror-focused {
          /* Slash Menu Placeholder */
          > p.is-empty::before {
            content: "${t('editor.placeholder')}";
          }
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return <EditorContent editor={editor} />;
};
