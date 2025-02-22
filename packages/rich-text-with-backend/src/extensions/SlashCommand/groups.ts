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
    name: 'basic',
    title: 'Basic',
    commands: [
      {
        name: 'text',
        label: t('editor.text'),
        iconName: 'Type',
        description: t('editor.text_description'),
        aliases: ['p', 't', 'paragraph', 'text'],
        action: (editor) => {
          editor.chain().focus().setParagraph().run();
        },
      },
      {
        name: 'heading1',
        label: t('editor.heading'),
        iconName: 'Heading1',
        description: t('editor.heading_description'),
        aliases: ['h', 'heading', 'h1'],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 1 }).run();
        },
      },
      {
        name: 'heading2',
        label: t('editor.subheading'),
        iconName: 'Heading2',
        description: t('editor.subheading_description'),
        aliases: ['h', 'h2'],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 2 }).run();
        },
      },
      {
        name: 'heading3',
        label: t('editor.subtitle'),
        iconName: 'Heading3',
        description: t('editor.subtitle_description'),
        aliases: ['h', 'h3'],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 3 }).run();
        },
      },
      {
        name: 'bulletList',
        label: t('editor.list'),
        iconName: 'List',
        description: t('editor.list_description'),
        aliases: ['l', 'ul', 'b', 'bu', 'bul'],
        action: (editor) => {
          editor.chain().focus().toggleBulletList().run();
        },
      },
      {
        name: 'numberedList',
        label: t('editor.numbered_list'),
        iconName: 'ListOrdered',
        description: t('editor.numbered_list_description'),
        aliases: ['l', 'ol'],
        action: (editor) => {
          editor.chain().focus().toggleOrderedList().run();
        },
      },
      {
        name: 'blockquote',
        label: t('editor.quote'),
        iconName: 'TextQuote',
        description: t('editor.quote_description'),
        aliases: ['q'],
        action: (editor) => {
          editor.chain().focus().setBlockquote().run();
        },
      },
      {
        name: 'codeBlock',
        label: t('editor.code_block'),
        iconName: 'SquareCode',
        description: t('editor.code_block_description'),
        aliases: ['c', 'code'],
        shouldBeHidden: (editor) => editor.isActive('columns'),
        action: (editor) => {
          editor.chain().focus().setCodeBlock().run();
        },
      },
      {
        name: 'horizontalRule',
        label: t('editor.divider'),
        iconName: 'Minus',
        description: t('editor.divider_description'),
        aliases: ['h', 'hr'],
        action: (editor) => {
          editor.chain().focus().setHorizontalRule().run();
        },
      },
    ],
  },
  {
    name: 'media',
    title: 'Media',
    commands: [
      {
        name: 'image',
        label: t('editor.image'),
        iconName: 'Image',
        description: t('editor.image_description'),
        aliases: ['i', 'img'],
        action: (editor) => {
          editor.chain().focus().setImageUpload().run();
        },
      },
    ],
  },
];
