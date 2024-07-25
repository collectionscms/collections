import { Box } from '@mui/material';
import React, { ReactNode } from 'react';

export type Props = {
  index: number;
  value: number;
  children?: ReactNode;
};

export const TabPanel: React.FC<Props> = ({ index, value, children }) => {
  return (
    <Box role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </Box>
  );
};
