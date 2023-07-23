import { Box } from '@mui/material';
import React from 'react';
import { Props } from './types.js';

export const TabPanel: React.FC<Props> = ({ index, value, children }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};
