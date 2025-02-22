import { Editor, NodeViewWrapper } from '@tiptap/react';
import React, { useCallback } from 'react';
import { ImageUploader } from './ImageUploader';

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

  const onDelete = useCallback(() => {
    editor.chain().setNodeSelection(getPos()).deleteSelection().run();
  }, [getPos, editor]);

  return (
    <NodeViewWrapper>
      <div className="p-0 m-0" data-drag-handle>
        <ImageUploader onUpload={onUpload} onDelete={onDelete} />
      </div>
    </NodeViewWrapper>
  );
};

export default ImageUpload;
