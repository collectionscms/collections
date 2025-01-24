import { Placeholder } from '@tiptap/extension-placeholder';
import { EditorContent } from '@tiptap/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlockEditor } from './hooks/useBlockEditor';
import i18n from './locales/localization';
import './styles/index.css';

type Props = {
  language?: 'en' | 'ja';
};

export const TextEditor = ({ language = 'en' }: Props) => {
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
    i18n.changeLanguage(language);
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
  }, [language]);

  return (
    <>
      <EditorContent editor={editor} />
      <div>{characterCount.characters()}</div>
    </>
  );
};
