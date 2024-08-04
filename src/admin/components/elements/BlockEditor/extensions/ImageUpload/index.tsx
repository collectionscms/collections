import { Box } from '@mui/material';
import { Editor, NodeViewWrapper } from '@tiptap/react';
import React, { useCallback } from 'react';
import { ImageUploader } from './ImageUploader.js';

export const ImageUpload = ({ getPos, editor }: { getPos: () => number; editor: Editor }) => {
  const onUpload = useCallback(
    (url: string) => {
      if (url) {
        editor
          .chain()
          .setImageBlock({ src: url })
          .deleteRange({ from: getPos(), to: getPos() })
          .focus()
          .run();
      }
    },
    [getPos, editor]
  );

  return (
    <NodeViewWrapper>
      <Box>
        <ImageUploader onUpload={onUpload} />
      </Box>
    </NodeViewWrapper>
  );
};
