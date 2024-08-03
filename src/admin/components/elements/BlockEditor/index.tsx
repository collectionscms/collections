import { Box, Paper, Stack } from '@mui/material';
import { BubbleMenu, Editor, EditorContent } from '@tiptap/react';
import { Bold, Code, CodeXml, Italic, Strikethrough, Underline } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorMode } from '../../utilities/ColorMode/index.js';
import { useTextMenuContentTypes } from './hooks/useTextMenuContentTypes.js';
import { ContentTypeMenu } from './menus/ContentTypeMenu/index.js';
import { LinkMenu } from './menus/LinkMenu/index.js';
import './styles/index.css';
import { ToolbarButton } from './ToolbarButton/index.js';

const MemoLinkMenu = memo(LinkMenu);
const MemoContentTypeMenu = memo(ContentTypeMenu);

export type Props = {
  editor: Editor | null;
};

export const BlockEditor: React.FC<Props> = ({ editor }) => {
  const { t } = useTranslation();
  const { mode } = useColorMode();
  if (mode === 'light') {
    require('./styles/light.css');
  } else {
    require('./styles/dark.css');
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
              tooltip={`${t('editor.bold')}`}
              shortcuts={['Mod', 'B']}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold size={16} />
            </ToolbarButton>
            <ToolbarButton
              tooltip={`${t('editor.italic')}`}
              shortcuts={['Mod', 'I']}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic size={16} />
            </ToolbarButton>
            <ToolbarButton
              tooltip={`${t('editor.underline')}`}
              shortcuts={['Mod', 'U']}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <Underline size={16} />
            </ToolbarButton>
            <ToolbarButton
              tooltip={`${t('editor.strike_through')}`}
              shortcuts={['Mod', 'Shift', 'S']}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough size={16} />
            </ToolbarButton>
            <ToolbarButton
              tooltip={`${t('editor.code')}`}
              shortcuts={['Mod', 'E']}
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <Code size={16} />
            </ToolbarButton>
            <ToolbarButton
              tooltip={`${t('editor.code_block')}`}
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
