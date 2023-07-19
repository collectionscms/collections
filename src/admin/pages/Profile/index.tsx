import {
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MainCard } from 'superfast-ui';
import { useColorMode } from '../../components/utilities/ColorMode/index.js';
import { Mode } from '../../components/utilities/ColorMode/types.js';

export const Profile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { mode, setMode, autoMode } = useColorMode();

  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Grid container spacing={2.5}>
      <Grid xs={12} lg={8}>
        <MainCard>
          <Grid container spacing={3}>
            <Grid xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel>{t('language')}</InputLabel>
                <Select name="language" displayEmpty value={i18n.language} onChange={handleChange}>
                  <MenuItem value="ja">{t('japanese')}</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </Stack>
            </Grid>
            <Grid xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel>{t('theme')}</InputLabel>
                <RadioGroup
                  name="theme"
                  row
                  value={autoMode ? 'auto' : mode}
                  onChange={(e) => setMode(e.target.value as Mode)}
                >
                  <FormControlLabel value="auto" control={<Radio />} label={t('automatic')} />
                  <FormControlLabel value="light" control={<Radio />} label={t('light')} />
                  <FormControlLabel value="dark" control={<Radio />} label={t('dark')} />
                </RadioGroup>
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
};
