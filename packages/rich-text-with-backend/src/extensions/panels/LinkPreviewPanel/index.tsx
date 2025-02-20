import { Link, Paper } from '@mui/material';
import { t } from 'i18next';
import React from 'react';
import { Toolbar } from '../../../parts/Toolbar.js';
import { Icon } from '../../parts/Icon/index.js';
import { ToolbarButton } from '../../parts/ToolbarButton/index.js';

export type Props = {
  url: string;
  onEdit: () => void;
  onClear: () => void;
};

export const LinkPreviewPanel = ({ onClear, onEdit, url }: Props) => {
  return (
    <Paper
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        py: 1,
        px: 2,
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 6px 0px',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        color="inherit"
        sx={{ wordBreak: 'break-all' }}
      >
        {url}
      </Link>
      <Toolbar.Divider />
      <ToolbarButton tooltip={`${t('edit_link')}`} color="inherit" onClick={onEdit}>
        <Icon name="Pen" size={16} />
      </ToolbarButton>
      <ToolbarButton tooltip={`${t('remove_link')}`} color="inherit" onClick={onClear}>
        <Icon name="Trash2" size={16} />
      </ToolbarButton>
    </Paper>
  );
};
