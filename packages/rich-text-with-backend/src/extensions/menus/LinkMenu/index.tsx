import { BubbleMenu } from '@tiptap/react';
import React, { JSX, useCallback, useState } from 'react';
import { MenuProps } from '../../../extensions/menus/types';
import { LinkEditorPanel } from '../../../extensions/panels/LinkEditorPanel';
import { LinkPreviewPanel } from '../../../extensions/panels/LinkPreviewPanel';

export const LinkMenu = ({ editor, appendTo }: MenuProps): JSX.Element => {
  const [showEdit, setShowEdit] = useState(false);

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive('link');
    return isActive;
  }, [editor]);

  const { href: link, target } = editor.getAttributes('link');

  const handleEdit = useCallback(() => {
    setShowEdit(true);
  }, []);

  const onSetLink = useCallback(
    (url: string, openInNewTab?: boolean) => {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url, target: openInNewTab ? '_blank' : '' })
        .run();
      setShowEdit(false);
    },
    [editor]
  );

  const onUnsetLink = useCallback(() => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setShowEdit(false);
    return null;
  }, [editor]);

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="textMenu"
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        zIndex: 100,
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        appendTo: () => {
          return appendTo?.current;
        },
        onHidden: () => {
          setShowEdit(false);
        },
      }}
    >
      {showEdit ? (
        <LinkEditorPanel
          initialUrl={link}
          initialOpenInNewTab={target === '_blank'}
          onSetLink={onSetLink}
        />
      ) : (
        <LinkPreviewPanel url={link} onClear={onUnsetLink} onEdit={handleEdit} />
      )}
    </BubbleMenu>
  );
};
