import { SettingsEthernetOutlined } from '@mui/icons-material';
import { Accordion, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Props } from '../types';

export const ListO2oType: React.FC<Props> = (props) => {
  const { expanded, handleChange } = props;
  const { t } = useTranslation();

  return (
    <Stack sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.54)',
          color: 'white',
          zIndex: 100,
        }}
      >
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
        >
          <Typography variant="h6">coming soon..</Typography>
        </Box>
      </Box>
      <Accordion expanded={expanded} square disableGutters onChange={() => handleChange('listO2o')}>
        <AccordionSummary aria-controls="panel-content" id="panel-header">
          <Stack direction="row" columnGap={2}>
            <Box display="flex" alignItems="center">
              <SettingsEthernetOutlined />
            </Box>
            <Stack direction="column">
              <Typography variant="subtitle1">{t('field_interface.list_o2o')}</Typography>
              <Typography variant="caption">{t('field_interface.list_o2o_caption')}</Typography>
            </Stack>
          </Stack>
        </AccordionSummary>
      </Accordion>
    </Stack>
  );
};
