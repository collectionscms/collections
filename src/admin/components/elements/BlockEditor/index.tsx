import { Box } from '@mui/material';
import { Editor, EditorContent } from '@tiptap/react';
import React, { useEffect, useRef } from 'react';
import { useColorMode } from '../../utilities/ColorMode/index.js';
import { ContentItemMenu } from './menus/ContentItemMenu/index.js';
import { LinkMenu } from './menus/LinkMenu/index.js';
import { TextMenu } from './menus/TextMenu/index.js';
import './styles/index.css';

export type Props = {
  editor: Editor | null;
};

export const BlockEditor: React.FC<Props> = ({ editor }) => {
  const { mode } = useColorMode();
  const menuContainerRef = useRef(null);

  useEffect(() => {
    if (mode === 'light') {
      document.body.style.backgroundColor = '#fff';
    } else {
      document.body.style.backgroundColor = '#1e1e1e';
    }

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [mode]);

  if (!editor) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative' }} ref={menuContainerRef}>
      <EditorContent editor={editor} />
      <ContentItemMenu editor={editor} />
      <LinkMenu editor={editor} appendTo={menuContainerRef} />
      <TextMenu editor={editor} />
    </Box>
  );
};
