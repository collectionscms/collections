import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useColorMode } from '../../components/utilities/ColorMode';
import { Mode } from '../../components/utilities/ColorMode/types';
import { useDocumentInfo } from '../../components/utilities/DocumentInfo';

const MePage: React.FC = () => {
  const { localizedLabel } = useDocumentInfo();
  const { t, i18n } = useTranslation();
  const { mode, setMode, autoMode } = useColorMode();

  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Stack rowGap={3}>
      <Grid container spacing={2}>
        <Grid xs>
          <h1>{localizedLabel}</h1>
        </Grid>
      </Grid>
      <Grid container spacing={3} xs={12} xl={6}>
        <Grid xs={12} md={6}>
          <FormControl fullWidth>
            <FormLabel>{t('language')}</FormLabel>
            <Select displayEmpty value={i18n.language} onChange={handleChange}>
              <MenuItem value="ja">{t('japanese')}</MenuItem>
              <MenuItem value="en">English</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl>
            <FormLabel>{t('theme')}</FormLabel>
            <RadioGroup
              row
              value={autoMode ? 'auto' : mode}
              onChange={(e) => setMode(e.target.value as Mode)}
            >
              <FormControlLabel value="auto" control={<Radio />} label={t('automatic')} />
              <FormControlLabel value="light" control={<Radio />} label={t('light')} />
              <FormControlLabel value="dark" control={<Radio />} label={t('dark')} />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default MePage;
