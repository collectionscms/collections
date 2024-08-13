import { Box } from '@mui/material';
import { Editor, EditorContent } from '@tiptap/react';
import React, { useEffect } from 'react';
import { useColorMode } from '../../utilities/ColorMode/index.js';
import { ContentItemMenu } from './menus/ContentItemMenu/index.js';
import { TextMenu } from './menus/TextMenu/index.js';
import './styles/index.css';

export type Props = {
  editor: Editor | null;
};

export const BlockEditor: React.FC<Props> = ({ editor }) => {
  const { mode } = useColorMode();

  useEffect(() => {
    if (mode === 'light') {
      require('./styles/light.css');
      document.body.style.backgroundColor = '#fff';
    } else {
      require('./styles/dark.css');
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
    <Box sx={{ position: 'relative' }}>
      <EditorContent editor={editor} />
      <ContentItemMenu editor={editor} />
      <TextMenu editor={editor} />
    </Box>
  );
};
