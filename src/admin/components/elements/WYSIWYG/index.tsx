import { Paper, Stack } from '@mui/material';
import {
  RiBold,
  RiCodeLine,
  RiCodeSSlashLine,
  RiItalic,
  RiStrikethrough,
  RiUnderline,
} from '@remixicon/react';
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
          <Paper elevation={1} sx={{ p: 0.4, borderRadius: 2 }}>
            <Stack direction="row" gap={0.5}>
              <IconButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                color="secondary"
                size="small"
                sx={{ borderRadius: 1.5 }}
              >
                <RiBold size={18} />
              </IconButton>
              <IconButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                color="secondary"
                size="small"
                sx={{ borderRadius: 1.5 }}
              >
                <RiItalic size={18} />
              </IconButton>
              <IconButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                color="secondary"
                size="small"
                sx={{ borderRadius: 1.5 }}
              >
                <RiUnderline size={18} />
              </IconButton>
              <IconButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                color="secondary"
                size="small"
                sx={{ borderRadius: 1.5 }}
              >
                <RiStrikethrough size={18} />
              </IconButton>
              <IconButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                color="secondary"
                size="small"
                sx={{ borderRadius: 1.5 }}
              >
                <RiCodeLine size={18} />
              </IconButton>
              <IconButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                color="secondary"
                size="small"
                sx={{ borderRadius: 1.5 }}
              >
                <RiCodeSSlashLine size={18} />
              </IconButton>
            </Stack>
          </Paper>
        </BubbleMenu>
      )}
    </>
  );
};
