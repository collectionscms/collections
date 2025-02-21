import React from 'react';
import { useTranslation } from 'react-i18next';
import { Surface } from '../../../parts/Surface';
import { Toolbar } from '../../../parts/Toolbar';
import Tooltip from '../../../parts/Tooltip';
import { Icon } from '../../parts/Icon/index';

export type Props = {
  url: string;
  onEdit: () => void;
  onClear: () => void;
};

export const LinkPreviewPanel = ({ onClear, onEdit, url }: Props) => {
  const { t } = useTranslation();
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
      <Tooltip title={t('edit_link')}>
        <Toolbar.Button onClick={onEdit}>
          <Icon name="Pen" />
        </Toolbar.Button>
      </Tooltip>
      <Tooltip title={t('remove_link')}>
        <Toolbar.Button onClick={onClear}>
          <Icon name="Trash2" />
        </Toolbar.Button>
      </Tooltip>
    </Surface>
  );
};
