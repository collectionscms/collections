import { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import { ShouldShowProps } from '../menus/types.js';
import isCustomNodeSelected from '../utilities/isCustomNodeSelected.js';
import isTextSelected from '../utilities/isTextSelected.js';

export const useTextMenuStates = (editor: Editor) => {
  const shouldShow = useCallback(
    ({ view, from }: ShouldShowProps) => {
      if (!view) {
        return false;
      }

      const domAtPos = view.domAtPos(from || 0).node as HTMLElement;
      const nodeDOM = view.nodeDOM(from || 0) as HTMLElement;
      const node = nodeDOM || domAtPos;

      if (isCustomNodeSelected(editor, node)) {
        return false;
      }

      return isTextSelected({ editor });
    },
    [editor]
  );

  return {
    isBold: editor.isActive('bold'),
    isItalic: editor.isActive('italic'),
    isStrike: editor.isActive('strike'),
    isUnderline: editor.isActive('underline'),
    isCode: editor.isActive('code'),
    // todo - add color menu
    // currentColor: editor.getAttributes('textStyle')?.color || undefined,
    shouldShow,
  };
};
