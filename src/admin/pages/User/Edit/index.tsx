import { Mode, useTheme } from '@admin/components/utilities/Theme';
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export type OnChange<T = string> = (value: T) => void;

const EditPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { mode, setMode, autoMode } = useTheme();

  return (
    <>
      <Box>{id ? 'Edit' : 'Create'} User</Box>
      <Box>
        <FormControl>
          <FormLabel>{t('label.theme')}</FormLabel>
          <RadioGroup
            row
            value={autoMode ? 'auto' : mode}
            onChange={(e) => setMode(e.target.value as Mode)}
          >
            <FormControlLabel value="auto" control={<Radio />} label={t('label.automatic')} />
            <FormControlLabel value="light" control={<Radio />} label={t('label.light')} />
            <FormControlLabel value="dark" control={<Radio />} label={t('label.dark')} />
          </RadioGroup>
        </FormControl>
      </Box>
    </>
  );
};

export default EditPage;
