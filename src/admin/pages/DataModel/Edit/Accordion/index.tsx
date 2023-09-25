import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Accordion as MuiAccordion,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { Props } from './types.js';

export const Accordion: React.FC<Props> = (props) => {
  const { children, expanded, title, description, type, icon, handleChange } = props;
  const Icon = icon;
  const theme = useTheme();

  const style = type === 'top' || type === 'middle' ? { borderBottom: 'none' } : {};

  return (
    <Box
      sx={{
        '& .MuiAccordion-root': {
          borderColor: theme.palette.divider,
          '& .MuiAccordionSummary-root': {
            bgcolor: 'transparent',
            flexDirection: 'row',
          },
          '& .Mui-expanded': {
            color: theme.palette.primary.main,
          },
        },
      }}
    >
      <MuiAccordion expanded={expanded} square disableGutters onChange={handleChange} sx={style}>
        <AccordionSummary aria-controls="panel-content" id="panel-header">
          <Stack direction="row" columnGap={2}>
            <Box display="flex" alignItems="center" sx={{ fontSize: '20px' }}>
              <Icon />
            </Box>
            <Stack direction="column">
              <Typography variant="subtitle1">{title}</Typography>
              <Typography variant="caption">{description}</Typography>
            </Stack>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>{children}</AccordionDetails>
      </MuiAccordion>
    </Box>
  );
};
