import { Editor } from '@tiptap/react';
import { Link } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { ToolbarButton } from '../../ToolbarButton/index.js';
import { EditLinkPopover } from './EditLinkPopover.js';

type Props = {
  editor: Editor;
};

export const LinkMenu: React.FC<Props> = ({ editor }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive('link');
    return isActive;
  }, [editor]);
  const { href: link, target } = editor.getAttributes('link');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <ToolbarButton tooltip="Link" onClick={handleClick}>
        <Link size={16} />
      </ToolbarButton>
      <EditLinkPopover
        anchorEl={anchorEl}
        shouldShow={shouldShow()}
        initialUrl={link}
        initialOpenInNewTab={target === '_blank'}
        onSetLink={(link, openInNewTab) => {
          setAnchorEl(null);
          editor
            .chain()
            .focus()
            .setLink({ href: link, target: openInNewTab ? '_blank' : null })
            .run();
        }}
        onRemoveLink={() => {
          setAnchorEl(null);
          editor.chain().focus().unsetLink().run();
        }}
        onClose={() => {
          setAnchorEl(null);
        }}
      />
    </>
  );
};
