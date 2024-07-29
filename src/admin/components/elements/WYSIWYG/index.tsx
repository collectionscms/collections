import { Paper, Stack } from '@mui/material';
import { BubbleMenu, Editor, EditorContent } from '@tiptap/react';
import { Bold, Code, CodeXml, Italic, Strikethrough, Underline } from 'lucide-react';
import React from 'react';
import { useColorMode } from '../../utilities/ColorMode/index.js';
import { LinkMenu } from './menus/LinkMenu.js';
import { ToolbarButton } from './ToolbarButton/index.js';

export type Props = {
  editor: Editor;
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
              {/* tooltip を含めたコンポーネントとしてあとで纏める */}
              <ToolbarButton
                shortcuts={['Mod', 'B']}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <Bold size={16} />
              </ToolbarButton>
              <ToolbarButton
                shortcuts={['Mod', 'I']}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <Italic size={16} />
              </ToolbarButton>
              <ToolbarButton
                shortcuts={['Mod', 'U']}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              >
                <Underline size={16} />
              </ToolbarButton>
              <ToolbarButton
                shortcuts={['Mod', 'Shift', 'S']}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              >
                <Strikethrough size={16} />
              </ToolbarButton>
              <ToolbarButton
                shortcuts={['Mod', 'E']}
                onClick={() => editor.chain().focus().toggleCode().run()}
              >
                <Code size={16} />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
                <CodeXml size={16} />
              </ToolbarButton>
              <LinkMenu editor={editor} />
            </Stack>
          </Paper>
        </BubbleMenu>
      )}
    </>
  );
};
