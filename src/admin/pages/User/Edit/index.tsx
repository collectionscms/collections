import RouterLink from '@admin/components/elements/Link';
import { Type } from '@admin/components/elements/Table/Cell/types';
import { useColorMode } from '@admin/components/utilities/ColorMode';
import Grid from '@mui/material/Unstable_Grid2';
import { Mode } from '@admin/components/utilities/ColorMode/types';
import {
  Box,
  BoxProps,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const Item = (props: BoxProps) => {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    />
  );
};

export type OnChange<T = string> = (value: T) => void;

const EditPage: React.FC = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { mode, setMode, autoMode } = useColorMode();

  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Item>
          <h1>{id ? 'Edit' : 'Create'} User</h1>
        </Item>
      </Box>
      <Grid container spacing={3} xs={12} xl={6}>
        <Grid xs={12} md={6}>
          <Item>
            <FormControl fullWidth>
              <FormLabel>{t('label.language')}</FormLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                displayEmpty
                value={i18n.language}
                onChange={handleChange}
              >
                <MenuItem value="ja">{t('label.japanese')}</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
          </Item>
        </Grid>
        <Grid xs={12} md={6}>
          <Item>
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
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditPage;
