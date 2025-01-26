import { Placeholder } from '@tiptap/extension-placeholder';
import { EditorContent } from '@tiptap/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlockEditor } from './hooks/useBlockEditor';
import i18n from './locales/localization';
import './styles/index.css';

type Props = {
  projectId: string;
  apiKey: string;
  id: string | null;
  options?: {
    language?: 'en' | 'ja';
  };
  onInit?: (id: string) => void;
};

export const RichText = ({
  projectId,
  apiKey,
  id,
  options = { language: 'en' },
  onInit,
}: Props) => {
  const { t } = useTranslation();
  const [isDirty, setIsDirty] = useState(false);
  const [contentId, setContentId] = useState(id);

  const fetchContent = async () => {
    try {
      const res = await fetch(`https://${projectId}.collections.dev/api/v1/contents/${contentId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const data = await res.json();
      editor?.commands.setContent(data.content.bodyJson);
    } catch (error) {
      throw error;
    }
  };

  const createContent = async () => {
    try {
      const res = await fetch(`https://${projectId}.collections.dev/api/v1/contents`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const data = await res.json();
      setContentId(data.content.id);
      onInit?.(data.content.id);
    } catch (error) {
      throw error;
    }
  };

  const updateContent = async (
    body: string | null,
    bodyHtml: string | null,
    bodyJson: string | null
  ) => {
    try {
      await fetch(`https://${projectId}.collections.dev/api/v1/contents/${contentId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          body,
          bodyHtml,
          bodyJson,
        }),
      });
    } catch (error) {
      throw error;
    }
  };

  const { editor, characterCount } = useBlockEditor({
    initialContent: '',
    extensions: [
      Placeholder.configure({
        placeholder: t('editor.placeholder'),
      }),
    ],
  });

  // on mount
  useEffect(() => {
    if (id) {
      fetchContent();
    } else {
      createContent();
    }

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

  useEffect(() => {
    if (isDirty) {
      // auto save after 5 seconds
      const timer = setTimeout(async () => {
        await updateContent(
          editor?.getText() ?? null,
          editor?.getHTML() ?? null,
          JSON.stringify(editor?.getJSON()) ?? null
        );
        setIsDirty(false);
      }, 5_000);

      return () => clearTimeout(timer);
    }
  }, [editor?.getHTML()]);

  useEffect(() => {
    if (editor) {
      const handleUpdate = () => {
        setIsDirty(true);
      };

      // Set the cursor to the beginning of the editor
      editor.commands.setTextSelection(0);
      editor.view.focus();

      editor.on('update', handleUpdate);

      return () => {
        editor.off('update', handleUpdate);
      };
    }
  }, [editor]);

  return (
    <>
      <EditorContent editor={editor} />
      <div>{characterCount.characters()}</div>
    </>
  );
};
