import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
} from '@ant-design/icons';
import { Paper, Stack } from '@mui/material';
import { BubbleMenu, Editor, EditorContent } from '@tiptap/react';
import React from 'react';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { useColorMode } from '../../utilities/ColorMode/index.js';

export type Props = {
  editor: Editor | null;
};

export const WYSIWYG: React.FC<Props> = ({ editor }) => {
  const { mode } = useColorMode();
  if (mode === 'light') {
    require('./light.css');
  } else {
    require('./dark.css');
  }

  return (
    <>
      <EditorContent editor={editor} />
      {editor && (
        <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
          <Paper elevation={1} sx={{ p: 0.2 }}>
            <Stack direction="row">
              <IconButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                color="secondary"
                size="small"
              >
                <BoldOutlined style={{ fontSize: 16 }} />
              </IconButton>
              <IconButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                color="secondary"
                size="small"
              >
                <ItalicOutlined style={{ fontSize: 16 }} />
              </IconButton>
              <IconButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                color="secondary"
                size="small"
              >
                <UnderlineOutlined style={{ fontSize: 16 }} />
              </IconButton>
              <IconButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                color="secondary"
                size="small"
              >
                <StrikethroughOutlined style={{ fontSize: 16 }} />
              </IconButton>
            </Stack>
          </Paper>
        </BubbleMenu>
      )}
    </>
  );
};
