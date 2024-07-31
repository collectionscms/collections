import { Box, Paper, Stack } from '@mui/material';
import { BubbleMenu, Editor, EditorContent } from '@tiptap/react';
import { Bold, Code, CodeXml, Italic, Strikethrough, Underline } from 'lucide-react';
import React, { memo } from 'react';
import { useColorMode } from '../../utilities/ColorMode/index.js';
import { useTextMenuContentTypes } from './hooks/useTextMenuContentTypes.js';
import { ContentTypeMenu } from './menus/ContentTypeMenu/index.js';
import { LinkMenu } from './menus/LinkMenu/index.js';
import { ToolbarButton } from './ToolbarButton/index.js';

const MemoLinkMenu = memo(LinkMenu);
const MemoContentTypeMenu = memo(ContentTypeMenu);

export type Props = {
  editor: Editor | null;
};

export const BlockEditor: React.FC<Props> = ({ editor }) => {
  const { mode } = useColorMode();
  if (mode === 'light') {
    require('./light.css');
  } else {
    require('./dark.css');
  }

  if (!editor) {
    return null;
  }

  const blockOptions = useTextMenuContentTypes(editor);

  return (
    <Box sx={{ position: 'relative' }}>
      <EditorContent editor={editor} />
      <BubbleMenu
        className="bubble-menu"
        tippyOptions={{ popperOptions: { placement: 'top-start' } }}
        editor={editor}
        updateDelay={100}
      >
        <Paper elevation={1} sx={{ p: 0.5, borderRadius: 2 }}>
          <Stack direction="row" gap={0.5} alignItems="center">
            <MemoContentTypeMenu options={blockOptions} />
            <ToolbarButton
              tooltip="Bold"
              shortcuts={['Mod', 'B']}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold size={16} />
            </ToolbarButton>
            <ToolbarButton
              tooltip="Italic"
              shortcuts={['Mod', 'I']}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic size={16} />
            </ToolbarButton>
            <ToolbarButton
              tooltip="Underline"
              shortcuts={['Mod', 'U']}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <Underline size={16} />
            </ToolbarButton>
            <ToolbarButton
              tooltip="Strike-through"
              shortcuts={['Mod', 'Shift', 'S']}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough size={16} />
            </ToolbarButton>
            <ToolbarButton
              tooltip="Code"
              shortcuts={['Mod', 'E']}
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <Code size={16} />
            </ToolbarButton>
            <ToolbarButton
              tooltip="Code Block"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <CodeXml size={16} />
            </ToolbarButton>
            <MemoLinkMenu editor={editor} />
          </Stack>
        </Paper>
      </BubbleMenu>
    </Box>
  );
};
