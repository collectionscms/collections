import { Paper, Stack, Typography } from '@mui/material';
import * as Popover from '@radix-ui/react-popover';
import DragHandle from '@tiptap-pro/extension-drag-handle-react';
import { Editor } from '@tiptap/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../../Icon/index.js';
import { DropdownButton } from '../../ui/DropdownButton/index.js';
import { ToolbarButton } from '../../ui/ToolbarButton/index.js';
import { useContentItemActions } from './hooks/useContentItemActions.js';
import { useData } from './hooks/useData.js';

export type Props = {
  editor: Editor;
};

export const ContentItemMenu: React.FC<Props> = ({ editor }) => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const data = useData();
  const actions = useContentItemActions(editor, data.currentNode, data.currentNodePos);

  useEffect(() => {
    if (menuOpen) {
      editor.commands.setMeta('lockDragHandle', true);
    } else {
      editor.commands.setMeta('lockDragHandle', false);
    }
  }, [editor, menuOpen]);

  return (
    <DragHandle
      pluginKey="ContentItemMenu"
      editor={editor}
      onNodeChange={data.handleNodeChange}
      tippyOptions={{
        offset: [-2, 16],
        zIndex: 99,
      }}
    >
      <Stack direction="row" alignItems="center" gap={0.5}>
        <ToolbarButton onClick={actions.handleAdd}>
          <Icon name="Plus" />
        </ToolbarButton>
        <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Popover.Trigger asChild>
            <ToolbarButton>
              <Icon name="GripVertical" />
            </ToolbarButton>
          </Popover.Trigger>
          <Popover.Content side="bottom" align="start">
            <Paper sx={{ p: 1 }}>
              <Stack direction="column">
                <DropdownButton
                  onClick={() => {
                    setMenuOpen(false);
                    actions.duplicateNode();
                  }}
                >
                  <Icon name="Copy" size={18} />
                  <Typography sx={{ ml: 1 }}>{t('editor.duplicate')}</Typography>
                </DropdownButton>
                <DropdownButton
                  onClick={() => {
                    setMenuOpen(false);
                    actions.copyNodeToClipboard();
                  }}
                >
                  <Icon name="Clipboard" size={18} />
                  <Typography sx={{ ml: 1 }}>{t('editor.copy_to_clipboard')}</Typography>
                </DropdownButton>
                <DropdownButton
                  color="error"
                  onClick={() => {
                    setMenuOpen(false);
                    actions.deleteNode();
                  }}
                  sx={{
                    color: 'error.main',
                  }}
                >
                  <Icon name="Trash2" size={18} />
                  <Typography sx={{ ml: 1 }}>{t('delete')}</Typography>
                </DropdownButton>
              </Stack>
            </Paper>
          </Popover.Content>
        </Popover.Root>
      </Stack>
    </DragHandle>
  );
};
