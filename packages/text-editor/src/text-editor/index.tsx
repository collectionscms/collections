import { Placeholder } from '@tiptap/extension-placeholder';
import { EditorContent } from '@tiptap/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlockEditor } from './hooks/useBlockEditor';
import i18n from './locales/localization';
import './styles/index.css';

type Props = {
  projectId: string;
  slug: string;
  apiKey: string;
  options?: {
    language?: 'en' | 'ja';
  };
};

export const TextEditor = ({ projectId, slug, apiKey, options = { language: 'en' } }: Props) => {
  const { t } = useTranslation();

  const { editor, characterCount } = useBlockEditor({
    initialContent: '',
    extensions: [
      Placeholder.configure({
        placeholder: t('editor.placeholder'),
      }),
    ],
  });

  useEffect(() => {
    i18n.changeLanguage(options.language);
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
  }, [options.language]);

  useEffect(() => {
    console.log('changed', editor?.getText());
  }, [editor?.getText()]);

  return (
    <>
      <EditorContent editor={editor} />
      <div>{characterCount.characters()}</div>
    </>
  );
};
