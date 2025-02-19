import { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import { ShouldShowProps } from '../extensions/menus/TextMenu/types.js';
import isCustomNodeSelected from '../utilities/isCustomNodeSelected.js';
import isTextSelected from '../utilities/isTextSelected.js';

export const useTextMenuStates = (editor: Editor) => {
  const shouldShow = useCallback(
    ({ view }: ShouldShowProps) => {
      if (!view) {
        return false;
      }

      if (isCustomNodeSelected(editor)) {
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
    shouldShow,
  };
};
