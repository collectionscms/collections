import { Editor } from '@tiptap/core';
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

export const groups: Group[] = [
  {
    name: 'format',
    title: 'Format',
    commands: [
      {
        name: 'heading2',
        label: 'Heading 2',
        iconName: 'Heading2',
        description: 'Medium priority section title',
        aliases: ['h2'],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 2 }).run();
        },
      },
      {
        name: 'heading3',
        label: 'Heading 3',
        iconName: 'Heading3',
        description: 'Low priority section title',
        aliases: ['h3'],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 3 }).run();
        },
      },
      {
        name: 'bulletList',
        label: 'Bullet List',
        iconName: 'List',
        description: 'Unordered list of items',
        aliases: ['ul'],
        action: (editor) => {
          editor.chain().focus().toggleBulletList().run();
        },
      },
      {
        name: 'numberedList',
        label: 'Numbered List',
        iconName: 'ListOrdered',
        description: 'Ordered list of items',
        aliases: ['ol'],
        action: (editor) => {
          editor.chain().focus().toggleOrderedList().run();
        },
      },
      // {
      //   name: 'taskList',
      //   label: 'Task List',
      //   iconName: 'ListTodo',
      //   description: 'Task list with todo items',
      //   aliases: ['todo'],
      //   action: (editor) => {
      //     editor.chain().focus().toggleTaskList().run();
      //   },
      // },
      // {
      //   name: 'blockquote',
      //   label: 'Blockquote',
      //   iconName: 'Quote',
      //   description: 'Element for quoting',
      //   action: (editor) => {
      //     editor.chain().focus().setBlockquote().run();
      //   },
      // },
      {
        name: 'codeBlock',
        label: 'Code Block',
        iconName: 'SquareCode',
        description: 'Code block with syntax highlighting',
        shouldBeHidden: (editor) => editor.isActive('columns'),
        action: (editor) => {
          editor.chain().focus().setCodeBlock().run();
        },
      },
    ],
  },
  // {
  //   name: 'insert',
  //   title: 'Insert',
  //   commands: [
  //     {
  //       name: 'table',
  //       label: 'Table',
  //       iconName: 'Table',
  //       description: 'Insert a table',
  //       shouldBeHidden: (editor) => editor.isActive('columns'),
  //       action: (editor) => {
  //         editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run();
  //       },
  //     },
  //     {
  //       name: 'image',
  //       label: 'Image',
  //       iconName: 'Image',
  //       description: 'Insert an image',
  //       aliases: ['img'],
  //       action: (editor) => {
  //         editor.chain().focus().setImageUpload().run();
  //       },
  //     },
  //     {
  //       name: 'horizontalRule',
  //       label: 'Horizontal Rule',
  //       iconName: 'Minus',
  //       description: 'Insert a horizontal divider',
  //       aliases: ['hr'],
  //       action: (editor) => {
  //         editor.chain().focus().setHorizontalRule().run();
  //       },
  //     },
  //   ],
  // },
];
