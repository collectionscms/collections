import { SyncOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { enqueueSnackbar } from 'notistack';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IconButton, MainCard } from '@collectionscms/plugin-ui';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../../utilities/logger.js';
import { ConfirmDiscardDialog } from '../../components/elements/ConfirmDiscardDialog/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { useColorMode } from '../../components/utilities/ColorMode/index.js';
import { Mode } from '../../components/utilities/ColorMode/types.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  updateUser as updateUserSchema,
} from '../../fields/schemas/profile/updateUser.js';
import { useUnsavedChangesPrompt } from '../../hooks/useUnsavedChangesPrompt.js';
import { ProfileContextProvider, useProfile } from './Context/index.js';

const ProfilePageImpl: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { mode, setMode, autoMode } = useColorMode();
  const { updateApiKey } = useAuth();
  const { getMe, updateMe } = useProfile();
  const { data: me } = getMe();
  const { trigger, isMutating } = updateMe();

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: me.user.name,
      email: me.email,
      password: '',
      api_key: '',
    },
    resolver: yupResolver(updateUserSchema(t)),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleGenerateApiKey = () => {
    setValue('api_key', uuidv4());
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    if (!form.password) delete form.password;
    if (!form.api_key) delete form.api_key;

    try {
      reset(form);
      await trigger(form);
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
      if (form.api_key) updateApiKey(form.api_key);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <Grid container spacing={2.5} sx={{ mb: 1 }}>
        <Grid xs={12} lg={8}>
          <MainCard>
            <Grid container spacing={3}>
              <Grid xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel>{t('language')}</InputLabel>
                  <Select
                    name="language"
                    displayEmpty
                    value={i18n.language}
                    onChange={handleChange}
                  >
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
      <Grid container spacing={2.5}>
        <Grid xs={12} lg={8}>
          <MainCard>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel required>{t('name')}</InputLabel>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          error={errors.name !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.name?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel required>{t('email')}</InputLabel>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          error={errors.email !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.email?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel required>{t('password')}</InputLabel>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="password"
                          placeholder={t('hidden_for_security')}
                          fullWidth
                          error={errors.password !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.password?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="api_key">{t('api_key')}</InputLabel>
                    <Controller
                      name="api_key"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="api_key"
                          type="text"
                          placeholder={
                            me.apiKey ? t('hidden_for_security') : t('generate_api_key_placeholder')
                          }
                          fullWidth
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip title={t('generate_api_key')} placement="top">
                                  <IconButton
                                    edge="end"
                                    color="secondary"
                                    onClick={handleGenerateApiKey}
                                  >
                                    <SyncOutlined />
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }}
                          error={errors.api_key !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.api_key?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack direction="row" alignItems="right" justifyContent="right">
                    <Button variant="contained" type="submit" disabled={isMutating}>
                      {t('update')}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};

export const ProfilePage = ComposeWrapper({ context: ProfileContextProvider })(ProfilePageImpl);
