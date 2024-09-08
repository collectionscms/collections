import { Box } from '@mui/material';
import React from 'react';

type Props = {
  code: string;
  props: Record<string, unknown>;
};

export const NationalFlagIcon: React.FC<Props> = ({ code, props }) => {
  return (
    <Box
      component="img"
      src={`https://cdn.collections.dev/languages/${code}.svg`}
      sx={props}
      alt={code}
    />
  );
};
