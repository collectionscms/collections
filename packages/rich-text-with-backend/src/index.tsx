import { Placeholder } from '@tiptap/extension-placeholder';
import { EditorContent } from '@tiptap/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createContent, fetchContent, updateContent } from './api/content';
import { useBlockEditor } from './hooks/useBlockEditor';
import i18n from './locales/localization';
import './styles/index.css';

type Props = {
  projectId: string;
  apiKey: string;
  updateContentId?: string;
  updateDraftKey?: string;
  options?: {
    language?: 'en' | 'ja';
    immediatelyRender?: boolean;
  };
  onInit?: (id: string) => void;
};

export const RichText = ({
  projectId,
  apiKey,
  updateContentId,
  updateDraftKey,
  options = { language: 'en' },
  onInit,
}: Props) => {
  const { t } = useTranslation();
  const [isDirty, setIsDirty] = useState(false);
  const [contentId, setContentId] = useState(updateContentId);
  const [draftKey, setDraftKey] = useState(updateDraftKey ?? null);

  const fetchAndSetContent = async (contentId: string) => {
    const data = await fetchContent(projectId, contentId, apiKey, draftKey);
    editor?.commands.setContent(data.content.bodyHtml);
  };

  const createAndSetContent = async () => {
    const data = await createContent(projectId, apiKey);
    setContentId(data.content.id);
    setDraftKey(data.content.draftKey);
    onInit?.(data.content.id);
  };

  const saveContent = async (
    contentId: string,
    data: {
      body: string | null;
      bodyHtml: string | null;
      bodyJson: string | null;
    }
  ) => {
    await updateContent(projectId, contentId, apiKey, data);
  };

  const { editor, characterCount } = useBlockEditor({
    initialContent: '',
    extensions: [
      Placeholder.configure({
        placeholder: t('editor.placeholder'),
      }),
    ],
    immediatelyRender: options.immediatelyRender ?? true,
  });

  // on mount
  useEffect(() => {
    if (updateContentId) {
      fetchAndSetContent(updateContentId);
    } else {
      createAndSetContent();
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
    if (isDirty && contentId) {
      // auto save after 5 seconds
      const timer = setTimeout(async () => {
        await saveContent(contentId, {
          body: editor?.getText() ?? null,
          bodyHtml: editor?.getHTML() ?? null,
          bodyJson: editor?.getJSON() ? JSON.stringify(editor?.getJSON()) : null,
        });
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
