import { Paper, Stack } from '@mui/material';
import { BubbleMenu, Editor } from '@tiptap/react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../../Icon/index.js';
import { useTextMenuContentTypes } from '../../hooks/useTextMenuContentTypes.js';
import { ContentTypeMenu } from '../../menus/ContentTypeMenu/index.js';
import { LinkMenu } from '../../menus/LinkMenu/index.js';
import { ToolbarButton } from '../../ui/ToolbarButton/index.js';

const MemoLinkMenu = memo(LinkMenu);
const MemoContentTypeMenu = memo(ContentTypeMenu);

type Props = {
  editor: Editor;
};

export const TextMenu: React.FC<Props> = ({ editor }) => {
  const { t } = useTranslation();
  const blockOptions = useTextMenuContentTypes(editor);

  return (
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
            <Icon name="Bold" size={16} strokeWidth={2.5} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={`${t('editor.italic')}`}
            shortcuts={['Mod', 'I']}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Icon name="Italic" size={16} strokeWidth={2.5} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={`${t('editor.underline')}`}
            shortcuts={['Mod', 'U']}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Icon name="Underline" size={16} strokeWidth={2.5} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={`${t('editor.strike_through')}`}
            shortcuts={['Mod', 'Shift', 'S']}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Icon name="Strikethrough" size={16} strokeWidth={2.5} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={`${t('editor.code')}`}
            shortcuts={['Mod', 'E']}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Icon name="Code" size={16} strokeWidth={2.5} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={`${t('editor.code_block')}`}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Icon name="CodeXml" size={16} strokeWidth={2.5} />
          </ToolbarButton>
          <MemoLinkMenu editor={editor} />
        </Stack>
      </Paper>
    </BubbleMenu>
  );
};
