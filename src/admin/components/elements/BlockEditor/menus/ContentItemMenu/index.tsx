import { Stack } from '@mui/material';
import DragHandle from '@tiptap-pro/extension-drag-handle-react';
import { Editor } from '@tiptap/react';
import React from 'react';
import { Icon } from '../../../Icon/index.js';
import { ToolbarButton } from '../../ui/ToolbarButton/index.js';
import { useData } from './hooks/useData.js';

export type Props = {
  editor: Editor;
};

export const ContentItemMenu: React.FC<Props> = ({ editor }) => {
  const data = useData();

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
        <ToolbarButton
          sx={{
            cursor: 'grab',
            '&:active': {
              cursor: 'grabbing',
            },
          }}
        >
          <Icon name="GripVertical" size={16} />
        </ToolbarButton>
      </Stack>
    </DragHandle>
  );
};
