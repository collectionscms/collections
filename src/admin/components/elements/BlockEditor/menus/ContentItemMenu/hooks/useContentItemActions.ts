import { Editor } from '@tiptap/react';
import { useCallback } from 'react';

export const useContentItemActions = (editor: Editor, currentNodePos: number) => {
  const deleteNode = useCallback(() => {
    editor
      .chain()
      .setMeta('hideDragHandle', true)
      .setNodeSelection(currentNodePos)
      .deleteSelection()
      .run();
  }, [editor, currentNodePos]);

  return {
    deleteNode,
  };
};
