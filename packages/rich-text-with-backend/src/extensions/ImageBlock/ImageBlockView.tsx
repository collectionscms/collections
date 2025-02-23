import { Node } from '@tiptap/pm/model';
import { Editor, NodeViewWrapper } from '@tiptap/react';
import React, { useCallback, useRef, useState } from 'react';
import { Icon } from '../../extensions/parts/Icon';
import { Button } from '../../parts/Button';

interface ImageBlockViewProps {
  editor: Editor;
  getPos: () => number;
  node: Node;
  updateAttributes: (attrs: Record<string, string>) => void;
}

export const ImageBlockView = (props: ImageBlockViewProps) => {
  const [showClose, setShowClose] = useState(false);
  const { editor, getPos, node } = props;
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const { src } = node.attrs;

  const onClick = useCallback(() => {
    editor.commands.setNodeSelection(getPos());
  }, [getPos, editor.commands]);

  const onDelete = useCallback(() => {
    editor.chain().setNodeSelection(getPos()).deleteSelection().run();
  }, [getPos, editor]);

  return (
    <NodeViewWrapper>
      <div
        style={{ width: node.attrs.width }}
        className="relative"
        onMouseEnter={() => setShowClose(true)}
        onMouseLeave={() => setShowClose(false)}
      >
        {showClose && (
          <Button
            buttonSize="small"
            variant="tertiary"
            className="absolute top-3 right-3"
            onClick={onDelete}
          >
            <Icon name="X" />
          </Button>
        )}
        <div contentEditable={false} ref={imageWrapperRef}>
          <img className="block" src={src} alt="" onClick={onClick} />
        </div>
      </div>
    </NodeViewWrapper>
  );
};
