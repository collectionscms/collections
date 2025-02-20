import React from 'react';
import { Surface } from '../../../parts/Surface';
import { Toolbar } from '../../../parts/Toolbar';
import Tooltip from '../../../parts/Tooltip/index';
import { Icon } from '../../parts/Icon/index';

export type Props = {
  url: string;
  onEdit: () => void;
  onClear: () => void;
};

export const LinkPreviewPanel = ({ onClear, onEdit, url }: Props) => {
  const sanitizedLink = url?.startsWith('javascript:') ? '' : url;

  return (
    <Surface className="flex items-center gap-2 p-2">
      <a
        href={sanitizedLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline break-all"
      >
        {url}
      </a>
      <Toolbar.Divider />
      <Tooltip title="Edit link">
        <Toolbar.Button onClick={onEdit}>
          <Icon name="Pen" size={16} />
        </Toolbar.Button>
      </Tooltip>
      <Tooltip title="Remove link">
        <Toolbar.Button onClick={onClear}>
          <Icon name="Trash2" size={16} />
        </Toolbar.Button>
      </Tooltip>
    </Surface>
  );
};
