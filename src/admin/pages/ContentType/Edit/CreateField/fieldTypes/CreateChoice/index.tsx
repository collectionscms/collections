import { yupResolver } from '@hookform/resolvers/yup';
import { CloseOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Drawer,
  FormHelperText,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { t } from 'i18next';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import createChoiceSchema, {
  FormValues,
} from '../../../../../../fields/schemas/collectionFields/createChoice';
import { Props } from './types';

export const CreateChoice: React.FC<Props> = ({ openState, onSuccess, onClose }) => {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { label: '', value: '' },
    resolver: yupResolver(createChoiceSchema()),
  });

  const onToggle = () => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    onClose();
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    onSuccess({ label: form.label, value: form.value });
    reset();
  };

  return (
    <Box>
      <Drawer
        anchor="right"
        open={openState}
        onClose={onToggle()}
        sx={{ zIndex: theme.zIndex.appBar + 200 }}
      >
        <Stack direction="row" columnGap={2} sx={{ p: 1 }}>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseOutlined />
          </IconButton>
          <Box display="flex" alignItems="center">
            <Typography variant="h6">{t('add_new_choice')}</Typography>
          </Box>
        </Stack>
        <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack rowGap={3} sx={{ p: 2 }}>
            <Grid container spacing={3} columns={{ xs: 1, sm: 4 }}>
              <Grid xs={1} sm={2}>
                <InputLabel required>{t('value')}</InputLabel>
                <Controller
                  name="value"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="text"
                      fullWidth
                      error={errors.value !== undefined}
                    />
                  )}
                />
                <FormHelperText error>{errors.value?.message}</FormHelperText>
              </Grid>
              <Grid xs={1} sm={2}>
                <InputLabel required>{t('label')}</InputLabel>
                <Controller
                  name="label"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="text"
                      fullWidth
                      error={errors.label !== undefined}
                    />
                  )}
                />
                <FormHelperText error>{errors.label?.message}</FormHelperText>
              </Grid>
            </Grid>
            <Button variant="contained" type="submit" size="large" fullWidth>
              {t('add')}
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </Box>
  );
};
