import * as Popover from '@radix-ui/react-popover';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Toolbar } from '../../../parts/Toolbar';
import { LinkEditorPanel } from '../../panels/LinkEditorPanel/index.js';
import { Icon } from '../../parts/Icon';

export type EditLinkPopoverProps = {
  onSetLink: (link: string, openInNewTab?: boolean) => void;
};

export const EditLinkPopover = ({ onSetLink }: EditLinkPopoverProps) => {
  const { t } = useTranslation();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Toolbar.Button tooltip={t('editor.link')}>
          <Icon name="Link" size={16} />
        </Toolbar.Button>
      </Popover.Trigger>
      <Popover.Content>
        <LinkEditorPanel onSetLink={onSetLink} />
      </Popover.Content>
    </Popover.Root>
  );
};
