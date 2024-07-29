import { IconButton } from '@mui/material';
import { Editor } from '@tiptap/react';
import { Link } from 'lucide-react';
import React, { useCallback, useState } from 'react';
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

  console.log('LinkMenu', link, target);

  return (
    <>
      <IconButton onClick={handleClick} color="secondary" size="small" sx={{ borderRadius: 1.5 }}>
        <Link size={16} />
      </IconButton>
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
