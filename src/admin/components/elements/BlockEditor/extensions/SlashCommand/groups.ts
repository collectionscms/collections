import { Editor } from '@tiptap/core';
import { TFunction } from 'i18next';
import { icons } from 'lucide-react';

export interface Command {
  name: string;
  label: string;
  description: string;
  aliases?: string[];
  iconName: keyof typeof icons;
  action: (editor: Editor) => void;
  shouldBeHidden?: (editor: Editor) => boolean;
}

export interface MenuListProps {
  editor: Editor;
  items: Group[];
  command: (command: Command) => void;
}

export interface Group {
  name: string;
  title: string;
  commands: Command[];
}

export const groups = (t: TFunction): Group[] => [
  {
    name: 'format',
    title: 'FORMAT',
    commands: [
      {
        name: 'text',
        label: t('editor.text'),
        iconName: 'Pilcrow',
        description: 'Medium priority section title',
        aliases: ['paragraph'],
        action: (editor) => {
          editor.chain().focus().setParagraph().run();
        },
      },
      {
        name: 'heading1',
        label: t('editor.heading'),
        iconName: 'Heading1',
        description: 'High priority section title',
        aliases: ['h1'],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 1 }).run();
        },
      },
      {
        name: 'heading2',
        label: t('editor.subheading'),
        iconName: 'Heading2',
        description: 'Medium priority section title',
        aliases: ['h2'],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 2 }).run();
        },
      },
      {
        name: 'heading3',
        label: t('editor.subtitle'),
        iconName: 'Heading3',
        description: 'Low priority section title',
        aliases: ['h3'],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 3 }).run();
        },
      },
      {
        name: 'bulletList',
        label: t('editor.list'),
        iconName: 'List',
        description: 'Unordered list of items',
        aliases: ['ul'],
        action: (editor) => {
          editor.chain().focus().toggleBulletList().run();
        },
      },
      {
        name: 'numberedList',
        label: t('editor.numbered_list'),
        iconName: 'ListOrdered',
        description: 'Ordered list of items',
        aliases: ['ol'],
        action: (editor) => {
          editor.chain().focus().toggleOrderedList().run();
        },
      },
      {
        name: 'blockquote',
        label: t('editor.quote'),
        iconName: 'Quote',
        description: 'Element for quoting',
        action: (editor) => {
          editor.chain().focus().setBlockquote().run();
        },
      },
      {
        name: 'codeBlock',
        label: t('editor.code_block'),
        iconName: 'SquareCode',
        description: 'Code block with syntax highlighting',
        shouldBeHidden: (editor) => editor.isActive('columns'),
        action: (editor) => {
          editor.chain().focus().setCodeBlock().run();
        },
      },
    ],
  },
  {
    name: 'insert',
    title: 'INSERT',
    commands: [
      {
        name: 'image',
        label: t('editor.image'),
        iconName: 'Image',
        description: 'Insert an image',
        aliases: ['img'],
        action: (editor) => {
          editor.chain().focus().setImageUpload().run();
        },
      },
      {
        name: 'horizontalRule',
        label: t('editor.divider'),
        iconName: 'Minus',
        description: 'Insert a horizontal divider',
        aliases: ['hr'],
        action: (editor) => {
          editor.chain().focus().setHorizontalRule().run();
        },
      },
    ],
  },
];
