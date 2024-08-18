import * as Popover from '@radix-ui/react-popover';
import React from 'react';
import { Icon } from '../../../Icon/index.js';
import { LinkEditorPanel } from '../../panels/LinkEditorPanel/index.js';
import { ToolbarButton } from '../../ui/ToolbarButton/index.js';

export type EditLinkPopoverProps = {
  onSetLink: (link: string, openInNewTab?: boolean) => void;
};

export const EditLinkPopover = ({ onSetLink }: EditLinkPopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <ToolbarButton color="inherit" tooltip="Set Link">
          <Icon name="Link" size={16} />
        </ToolbarButton>
      </Popover.Trigger>
      <Popover.Content>
        <LinkEditorPanel onSetLink={onSetLink} />
      </Popover.Content>
    </Popover.Root>
  );
};
