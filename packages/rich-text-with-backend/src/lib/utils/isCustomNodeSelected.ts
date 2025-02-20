import { Editor } from '@tiptap/react';
import {
  CodeBlock,
  HorizontalRule,
  ImageBlock,
  ImageUpload,
  Link,
} from '../../extensions/index.js';

export const isCustomNodeSelected = (editor: Editor) => {
  const customNodes = [
    HorizontalRule.name,
    ImageUpload.name,
    ImageBlock.name,
    CodeBlock.name,
    Link.name,
  ];

  return customNodes.some((type) => editor.isActive(type));
};

export default isCustomNodeSelected;
