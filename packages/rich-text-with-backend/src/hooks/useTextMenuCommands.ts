import { Editor } from '@tiptap/react';
import { useCallback } from 'react';

export const useTextMenuCommands = (editor: Editor) => {
  const onBold = useCallback(() => editor.chain().focus().toggleBold().run(), [editor]);
  const onItalic = useCallback(() => editor.chain().focus().toggleItalic().run(), [editor]);
  const onStrike = useCallback(() => editor.chain().focus().toggleStrike().run(), [editor]);
  const onUnderline = useCallback(() => editor.chain().focus().toggleUnderline().run(), [editor]);
  const onCode = useCallback(() => editor.chain().focus().toggleCode().run(), [editor]);
  const onCodeBlock = useCallback(() => editor.chain().focus().toggleCodeBlock().run(), [editor]);
  const onLink = useCallback(
    (url: string, inNewTab?: boolean) =>
      editor
        .chain()
        .focus()
        .setLink({ href: url, target: inNewTab ? '_blank' : '' })
        .run(),
    [editor]
  );
  const onHeading = useCallback(() => {
    if (editor.isActive('heading', { level: 1 })) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().setHeading({ level: 1 }).run();
    }
  }, [editor]);
  const onSubheading = useCallback(() => {
    if (editor.isActive('heading', { level: 2 })) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().setHeading({ level: 2 }).run();
    }
  }, [editor]);
  const onSubtitle = useCallback(() => {
    if (editor.isActive('heading', { level: 3 })) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().setHeading({ level: 3 }).run();
    }
  }, [editor]);

  return {
    onBold,
    onItalic,
    onStrike,
    onUnderline,
    onCode,
    onCodeBlock,
    onLink,
    onHeading,
    onSubheading,
    onSubtitle,
  };
};
