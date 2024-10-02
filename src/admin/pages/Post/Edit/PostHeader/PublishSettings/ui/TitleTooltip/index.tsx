import { Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { Icon } from '../../../../../../../components/elements/Icon/index.js';

type Props = {
  tooltip: string;
  title: string;
};

export const TitleTooltip: React.FC<Props> = ({ tooltip, title }) => {
  return (
    <Stack flexDirection="row" alignItems="center" gap={1.5}>
      <Typography variant="subtitle1">{title}</Typography>
      <Tooltip title={tooltip} placement="right">
        <Stack alignItems="center">
          <Icon name="CircleHelp" size={16} />
        </Stack>
      </Tooltip>
    </Stack>
  );
};
