import { Stack } from '@mui/material';
import DragHandle from '@tiptap-pro/extension-drag-handle-react';
import { Editor } from '@tiptap/react';
import React, { useState } from 'react';
import { ToolbarButton } from '../../ToolbarButton/index.js';
import { Icon } from '../../ui/Icon/index.js';
import { useContentItemActions } from './hooks/useContentItemActions.js';
import { useData } from './hooks/useData.js';

export type Props = {
  editor: Editor;
};

export const ContentItemMenu: React.FC<Props> = ({ editor }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const data = useData();
  const actions = useContentItemActions(editor, data.currentNode, data.currentNodePos);

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
        <ToolbarButton onClick={actions.handleAdd} tooltip="Add content item">
          <Icon name="Plus" />
        </ToolbarButton>
      </Stack>
    </DragHandle>
  );
};
