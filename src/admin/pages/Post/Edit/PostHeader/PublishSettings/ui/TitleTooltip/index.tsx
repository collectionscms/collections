import { Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { Icon } from '../../../../../../../components/elements/Icon/index.js';

type Props = {
  tooltip: string;
  title: string;
  variant?: 'subtitle1' | 'body1';
};

export const TitleTooltip: React.FC<Props> = ({ tooltip, title, variant = 'subtitle1' }) => {
  return (
    <Stack flexDirection="row" alignItems="center" gap={1.5}>
      <Typography variant={variant}>{title}</Typography>
      <Tooltip title={tooltip} placement="right">
        <Stack alignItems="center">
          <Icon name="CircleHelp" size={16} />
        </Stack>
      </Tooltip>
    </Stack>
  );
};
