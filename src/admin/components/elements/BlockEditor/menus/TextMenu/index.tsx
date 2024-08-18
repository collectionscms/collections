import { Divider, Paper, Stack } from '@mui/material';
import { BubbleMenu, Editor } from '@tiptap/react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../../Icon/index.js';
import { useTextMenuCommands } from '../../hooks/useTextMenuCommands.js';
import { useTextMenuContentTypes } from '../../hooks/useTextMenuContentTypes.js';
import { useTextMenuStates } from '../../hooks/useTextMenuStates.js';
import { ContentTypeMenu } from '../../menus/ContentTypeMenu/index.js';
import { ToolbarButton } from '../../ui/ToolbarButton/index.js';
import { EditLinkPopover } from './EditLinkPopover.js';

const MemoContentTypeMenu = memo(ContentTypeMenu);

type Props = {
  editor: Editor;
};

export const TextMenu: React.FC<Props> = ({ editor }) => {
  const { t } = useTranslation();
  const commands = useTextMenuCommands(editor);
  const blockOptions = useTextMenuContentTypes(editor);
  const states = useTextMenuStates(editor);

  return (
    <BubbleMenu
      className="bubble-menu"
      tippyOptions={{ popperOptions: { placement: 'top-start' } }}
      editor={editor}
      shouldShow={states.shouldShow}
      updateDelay={100}
    >
      <Paper
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          paddingY: 0.5,
          paddingX: 1,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 6px 0px',
        }}
      >
        <Stack direction="row" gap={0.5} alignItems="center">
          <MemoContentTypeMenu options={blockOptions} />
          <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />
          <ToolbarButton
            tooltip={`${t('editor.bold')}`}
            shortcuts={['Mod', 'B']}
            color="inherit"
            onClick={commands.onBold}
          >
            <Icon name="Bold" size={16} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={`${t('editor.italic')}`}
            shortcuts={['Mod', 'I']}
            color="inherit"
            onClick={commands.onItalic}
          >
            <Icon name="Italic" size={16} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={`${t('editor.underline')}`}
            shortcuts={['Mod', 'U']}
            color="inherit"
            onClick={commands.onUnderline}
          >
            <Icon name="Underline" size={16} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={`${t('editor.strike_through')}`}
            shortcuts={['Mod', 'Shift', 'S']}
            color="inherit"
            onClick={commands.onStrike}
          >
            <Icon name="Strikethrough" size={16} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={`${t('editor.code')}`}
            shortcuts={['Mod', 'E']}
            color="inherit"
            onClick={commands.onCode}
          >
            <Icon name="Code" size={16} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={`${t('editor.code_block')}`}
            color="inherit"
            onClick={commands.onCodeBlock}
          >
            <Icon name="CodeXml" size={16} />
          </ToolbarButton>
          <EditLinkPopover onSetLink={commands.onLink} />
        </Stack>
      </Paper>
    </BubbleMenu>
  );
};
