import { Box } from '@mui/material';
import React from 'react';
import { useColorMode } from '../../utilities/ColorMode/index.js';

export type Props = {
  variant: 'icon' | 'logo';
  props: Record<string, unknown>;
};

export const Logo: React.FC<Props> = ({ variant, props }) => {
  const { mode } = useColorMode();
  return (
    <Box
      component="img"
      src={`https://cdn.collections.dev/${variant}-${mode}.svg`}
      sx={props}
      alt="logo"
    />
  );
};
