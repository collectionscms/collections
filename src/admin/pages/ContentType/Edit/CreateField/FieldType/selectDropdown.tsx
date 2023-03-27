import { FormatListBulletedOutlined } from '@mui/icons-material';
import { Accordion, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Props } from './types';

const SelectDropdownType: React.FC<Props> = (props) => {
  const { expanded, handleChange } = props;
  const { t } = useTranslation();

  return (
    <Stack>
      <Accordion
        expanded={expanded}
        square
        disableGutters
        onChange={() => handleChange('selectDropdown')}
      >
        <AccordionSummary aria-controls="panel-content" id="panel-header">
          <Stack direction="row" columnGap={2}>
            <Box display="flex" alignItems="center">
              <FormatListBulletedOutlined />
            </Box>
            <Stack direction="column">
              <Typography variant="subtitle1">{t('field_interface.select_dropdown')}</Typography>
              <Typography variant="caption">
                {t('field_interface.select_dropdown_caption')}
              </Typography>
            </Stack>
          </Stack>
        </AccordionSummary>
      </Accordion>
    </Stack>
  );
};

export default SelectDropdownType;
