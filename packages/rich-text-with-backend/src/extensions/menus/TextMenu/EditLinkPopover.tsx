import * as Popover from '@radix-ui/react-popover';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../parts/Icon';
import { LinkEditorPanel } from '../../panels/LinkEditorPanel/index.js';
import { ToolbarButton } from '../../parts/ToolbarButton/index.js';

export type EditLinkPopoverProps = {
  onSetLink: (link: string, openInNewTab?: boolean) => void;
};

export const EditLinkPopover = ({ onSetLink }: EditLinkPopoverProps) => {
  const { t } = useTranslation();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <ToolbarButton color="inherit" tooltip={t('link')}>
          <Icon name="Link" size={16} />
        </ToolbarButton>
      </Popover.Trigger>
      <Popover.Content>
        <LinkEditorPanel onSetLink={onSetLink} />
      </Popover.Content>
    </Popover.Root>
  );
};
