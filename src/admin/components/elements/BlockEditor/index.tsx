import { Box } from '@mui/material';
import { Editor, EditorContent } from '@tiptap/react';
import React from 'react';
import { useColorMode } from '../../utilities/ColorMode/index.js';
import { TextMenu } from './menus/TextMenu/index.js';
import './styles/index.css';

export type Props = {
  editor: Editor | null;
};

export const BlockEditor: React.FC<Props> = ({ editor }) => {
  const { mode } = useColorMode();
  if (mode === 'light') {
    require('./styles/light.css');
  } else {
    require('./styles/dark.css');
  }

  if (!editor) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <EditorContent editor={editor} />
      <TextMenu editor={editor} />
    </Box>
  );
};
