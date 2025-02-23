import { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import { ShouldShowProps } from '../extensions/menus/TextMenu/types';
import isCustomNodeSelected from '../lib/utils/isCustomNodeSelected';
import isTextSelected from '../lib/utils/isTextSelected';

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
    isHeading: editor.isActive('heading', { level: 1 }),
    isSubHeading: editor.isActive('heading', { level: 2 }),
    isSubTitle: editor.isActive('heading', { level: 3 }),
    shouldShow,
  };
};
