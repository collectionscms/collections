import { Editor } from '@tiptap/react';
import { useMemo } from 'react';
import { ContentTypePickerOption } from '../menus/ContentTypeMenu';
import { useTranslation } from 'react-i18next';

export const useTextMenuContentTypes = (editor: Editor) => {
  const { t } = useTranslation();

  const options = useMemo<ContentTypePickerOption[]>(() => {
    return [
      {
        icon: 'Pilcrow',
        onClick: () =>
          editor.chain().focus().lift('taskItem').liftListItem('listItem').setParagraph().run(),
        id: 'paragraph',
        disabled: () => !editor.can().setParagraph(),
        isActive: () =>
          editor.isActive('paragraph') &&
          !editor.isActive('orderedList') &&
          !editor.isActive('bulletList') &&
          !editor.isActive('taskList'),
        label: t('editor.text'),
        type: 'option',
      },
      {
        icon: 'Heading1',
        onClick: () =>
          editor
            .chain()
            .focus()
            .lift('taskItem')
            .liftListItem('listItem')
            .setHeading({ level: 1 })
            .run(),
        id: 'heading1',
        disabled: () => !editor.can().setHeading({ level: 1 }),
        isActive: () => editor.isActive('heading', { level: 1 }),
        label: t('editor.heading'),
        type: 'option',
      },
      {
        icon: 'Heading2',
        onClick: () =>
          editor
            .chain()
            .focus()
            .lift('taskItem')
            .liftListItem('listItem')
            .setHeading({ level: 2 })
            .run(),
        id: 'heading2',
        disabled: () => !editor.can().setHeading({ level: 2 }),
        isActive: () => editor.isActive('heading', { level: 2 }),
        label: t('editor.subheading'),
        type: 'option',
      },
      {
        icon: 'Heading3',
        onClick: () =>
          editor
            .chain()
            .focus()
            .lift('taskItem')
            .liftListItem('listItem')
            .setHeading({ level: 3 })
            .run(),
        id: 'heading3',
        disabled: () => !editor.can().setHeading({ level: 3 }),
        isActive: () => editor.isActive('heading', { level: 3 }),
        label: t('editor.subtitle'),
        type: 'option',
      },
      {
        icon: 'List',
        onClick: () => editor.chain().focus().toggleBulletList().run(),
        id: 'bulletList',
        disabled: () => !editor.can().toggleBulletList(),
        isActive: () => editor.isActive('bulletList'),
        label: t('editor.list'),
        type: 'option',
      },
      {
        icon: 'ListOrdered',
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        id: 'orderedList',
        disabled: () => !editor.can().toggleOrderedList(),
        isActive: () => editor.isActive('orderedList'),
        label: t('editor.numbered_list'),
        type: 'option',
      },
    ];
  }, [editor, editor.state]);

  return options;
};
