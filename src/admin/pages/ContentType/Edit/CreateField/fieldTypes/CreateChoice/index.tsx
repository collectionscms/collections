import { CloseOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Divider,
  Drawer,
  FormHelperText,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { t } from 'i18next';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { IconButton } from 'superfast-ui';
import {
  FormValues,
  createChoice as schema,
} from '../../../../../../fields/schemas/collectionFields/choice/createChoice.js';
import { Props } from './types.js';

export const CreateChoice: React.FC<Props> = ({ openState, onSuccess, onClose }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { label: '', value: '' },
    resolver: yupResolver(schema),
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
        PaperProps={{
          sx: {
            width: { xs: 340, md: 660 },
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4">{t('add_new_choice')}</Typography>
            <IconButton
              color="secondary"
              size="small"
              sx={{ fontSize: '0.875rem' }}
              onClick={onClose}
            >
              <CloseOutlined />
            </IconButton>
          </Stack>
        </Box>
        <Divider />
        <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack rowGap={3} sx={{ p: 3 }}>
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
